/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyPassword } from '@helpers/encrypt';
import { TempPassword } from '@models/TempPassword';
import { UserRole, User } from '@models/User';
import { MercuriusContext } from 'mercurius';
import { Op, Sequelize } from 'sequelize';
import { Arg, Field, ObjectType, Resolver, Query, Ctx, createUnionType } from 'type-graphql';
import { DefaultErrorObjectType, DefaultResponseType } from './common-types';

@ObjectType('SignInResponse')
export class SignInObjectType {
  @Field()
  hasOneTimePassword: boolean;
}

@ObjectType('AuthResponse')
export class AuthObjectType {
  @Field()
  token: string;
}

const SignInResponseType = createUnionType({
  name: 'SignInOrErrorResponse',
  types: () => [SignInObjectType, DefaultErrorObjectType] as const,
  resolveType: (value) => {
    if ('error' in value) {
      return DefaultErrorObjectType;
    } else {
      return SignInObjectType;
    }
  },
});

const AuthResponseType = createUnionType({
  name: 'AuthOrErrorResponse',
  types: () => [AuthObjectType, DefaultErrorObjectType] as const,
  resolveType: (value) => {
    if ('error' in value) {
      return DefaultErrorObjectType;
    } else {
      return AuthObjectType;
    }
  },
});

@Resolver()
export class AuthResolver {
  /**
   * Sign in
   */
  @Query(() => SignInResponseType)
  async signIn(@Arg('email') email: string, @Ctx() ctx: MercuriusContext): Promise<typeof SignInResponseType> {
    const user = await User.findOne({
      where: { email },
    });

    if (user === null) {
      ctx.reply.status(400);

      return { error: 'User not found or blocked' };
    }

    return { hasOneTimePassword: user.password ? false : true };
  }

  /**
   * Authorize with password
   */
  @Query(() => AuthResponseType)
  async authorize(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<typeof AuthResponseType> {
    const user = await User.findOne({
      where: {
        email,
        blocked: false,
        [Op.and]: Sequelize.where(Sequelize.col('password'), verifyPassword(ctx.app.sequelize, 'password', password)),
      },
    });

    if (user === null) {
      ctx.reply.status(400);

      return { error: 'User not found or blocked' };
    }

    const token = ctx.app.jwt.sign({
      id: user.id,
      role: UserRole.MEMBER,
    });

    return { token };
  }

  /**
   * Authorize with OTP
   */
  @Query(() => AuthResponseType)
  async authorizeWithOTP(
    @Arg('email') email: string,
    @Arg('tempPassword') tempPassword: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<typeof AuthResponseType> {
    let user = await User.findOne({
      include: [TempPassword],
      where: { email },
    });

    if (user === null) {
      ctx.reply.status(400);

      return { error: 'User not found' };
    }

    if (user.tempPassword?.expiresOn < new Date()) {
      ctx.reply.status(400);

      return { error: 'One-time password expired. Try sign in again.' };
    }

    user = await User.findOne({
      include: [
        {
          model: TempPassword,
          where: {
            expiresOn: { [Op.gt]: new Date() },
            [Op.and]: Sequelize.where(
              Sequelize.col('temp_password'),
              verifyPassword(ctx.app.sequelize as Sequelize, 'temp_password', tempPassword),
            ),
          },
        },
      ],
      where: {
        email,
        blocked: false,
      },
    });

    if (user === null) {
      ctx.reply.status(400);

      return { error: 'Password is wrong or the user blocked' };
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
  @Query(() => DefaultResponseType)
  async signUp(
    @Arg('email') email: string,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('country') country: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<typeof DefaultResponseType> {
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

        return { error: 'User already exists' };
      }

      await newUser.setOneTimePassword();

      return { result: true };
    } catch (exception) {
      ctx.app.log.error(exception);
      ctx.reply.status(400);

      return { error: exception.message };
    }
  }
}
