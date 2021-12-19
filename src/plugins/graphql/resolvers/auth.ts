/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyPassword } from '@helpers/encrypt';
import { TempPassword } from '@models/TempPassword';
import { UserRole, User } from '@models/User';
import { MercuriusContext } from 'mercurius';
import { FindOptions, ModelStatic, NonNullFindOptions, Op, Sequelize } from 'sequelize';
import { Arg, Resolver, Query, Ctx, Mutation } from 'type-graphql';
import { AuthResponseType, SignInResponseType } from '../odt/auth.types';
import { DefaultResponseType } from '../odt/common.types';

@Resolver()
export class AuthResolver {
  /**
   * Authorize with password
   */
  @Query(() => AuthResponseType)
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

        return { next: true };
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
      findOptions = {
        include: null,
        where: {
          ...findOptions.where,
          [Op.and]: Sequelize.where(Sequelize.col('password'), verifyPassword(ctx.app.sequelize, 'password', password)),
        },
      };
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

    return { token };
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
}
