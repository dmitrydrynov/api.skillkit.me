/* eslint-disable @typescript-eslint/no-unused-vars */
import ConnectedUser from '@entities/connected-users/connected-user.model';
import TempPassword from '@entities/temp-password/temp-password.model';
import User, { UserRole } from '@entities/user/user.model';
import { verifyPassword } from '@helpers/encrypt';
import { DefaultResponseType } from '@plugins/graphql/common.types';
import fetch from 'cross-fetch';
import { MercuriusContext } from 'mercurius';
import { FindOptions, Op, Sequelize } from 'sequelize';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AuthResponseType, AuthTokenResponseType } from './auth.types';
import CurrentUser from './current-user.decorator';

@Resolver()
export class AuthResolver {
  /**
   * Authorize with password
   */
  @Mutation(() => AuthResponseType)
  async signIn(
    @Arg('email') email: string,
    @Arg('password', { nullable: true }) password: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<typeof AuthResponseType> {
    let findOptions: FindOptions<any> = {
      include: [TempPassword],
      where: {
        email,
        blocked: false,
      },
    };

    let user = await User.findOne(findOptions);

    if (user === null) {
      ctx.reply.status(400);

      throw Error('User not found or blocked');
    }

    const enabledOneTimePassword = user.password === null;

    if (enabledOneTimePassword) {
      /** Need send one-time password or not */
      if (!password) {
        await user.setOneTimePassword();

        return { next: true, otp: true };
      }

      /** If one-time password exist but expired  */
      if (user.tempPassword?.expiresOn < new Date()) {
        await user.tempPassword.destroy();

        ctx.reply.status(400);

        throw Error('One-time password expired. Try sign in again.');
      }

      findOptions.include = [
        {
          model: TempPassword,
          where: {
            expiresOn: { [Op.gt]: new Date() },
            [Op.and]: Sequelize.where(
              Sequelize.col('temp_password'),
              verifyPassword(ctx.app.sequelize as Sequelize, 'temp_password', password),
            ),
          },
        },
      ];
    } else {
      if (password) {
        findOptions = {
          where: {
            ...findOptions.where,
            [Op.and]: Sequelize.where(
              Sequelize.col('password'),
              verifyPassword(ctx.app.sequelize, 'password', password),
            ),
          },
        };
      } else {
        return { next: true, otp: false };
      }
    }

    user = await User.findOne(findOptions);

    if (user === null) {
      ctx.reply.status(400);

      throw Error('Password is wrong.');
    }

    if (enabledOneTimePassword) {
      await user.tempPassword.destroy();
    }

    const token = ctx.app.jwt.sign({
      id: user.id,
      role: UserRole.MEMBER,
    });

    return { token, user };
  }

  /**
   * Authorize with code (OAuth2)
   */
  @Query(() => AuthTokenResponseType)
  async signInByCode(
    @Arg('code') code: string,
    @Arg('serviceName') serviceName: string,
    @Arg('state', { nullable: true }) state: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<AuthTokenResponseType> {
    const {
      reply: { request },
    } = ctx;

    const accessToken = await ctx.app.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow({
      query: request.body['variables'],
    });

    const userDataResponse: any = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${accessToken.token_type} ${accessToken.access_token}`,
      },
    });

    if (!userDataResponse.ok) {
      throw Error('User data not available.');
    }

    const userData = await userDataResponse.json();

    const [user, created] = await User.findOrCreate({
      include: [ConnectedUser],
      where: { email: userData.email },
      defaults: {
        email: userData.email,
        firstName: userData.username,
        lastName: '',
      },
    });

    if (user === null) {
      ctx.reply.status(400);

      throw Error('Authorisation is wrong.');
    }

    if (created || !user.hasConnectedWith(serviceName)) {
      const connectedUser = await ConnectedUser.create({
        userId: user.id,
        serviceName,
        serviceUserId: userData.id,
        nickname: userData.username,
        token: `${accessToken.token_type} ${accessToken.access_token}`,
        expiresIn: accessToken.expires_in,
      });

      user.connectedUsers.push(connectedUser);
    }

    if (!created && user.hasConnectedWith(serviceName)) {
      const connectedUser = await user.updateConnectedUser(serviceName, {
        nickname: userData.username,
        token: `${accessToken.token_type} ${accessToken.access_token}`,
        expiresIn: accessToken.expires_in,
      });

      if (!connectedUser) {
        throw Error('Authorisation is wrong.');
      }
    }

    const token = ctx.app.jwt.sign({
      id: user.id,
      role: UserRole.MEMBER,
    });

    return { token, user };
  }

  /**
   * Sign up
   */
  @Mutation(() => DefaultResponseType)
  async signUp(
    @Arg('email') email: string,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('country') country: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<DefaultResponseType> {
    try {
      const [newUser, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          firstName,
          lastName,
          email,
          country,
        },
      });

      if (!created) {
        ctx.reply.status(400);

        throw Error('User already exists.');
      }

      await newUser.setOneTimePassword();

      return { result: true };
    } catch (exception) {
      ctx.app.log.error(exception);
      ctx.reply.status(400);

      throw Error(exception.message);
    }
  }

  /**
   * Get authenticated user
   */
  @Query(() => User)
  async authenticatedUser(@CurrentUser() currentUser: User, @Ctx() ctx: MercuriusContext): Promise<User> {
    const user = await User.findByPk(currentUser.id);

    if (!user || user.blocked) {
      throw Error('Authenticated User not found or blocked');
    }

    return user;
  }
}
