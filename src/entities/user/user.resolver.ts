/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from '@config/env';
import Role from '@entities/role/role.model';
import { verifyPassword } from '@helpers/encrypt';
import { removeFile, uploadFile } from '@helpers/file';
import Hashids from 'hashids';
import { MercuriusContext } from 'mercurius';
import { Op, Sequelize } from 'sequelize';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import User, { UserRole } from './user.model';
import { UserDataInput, UserWhereUniqueInput } from './user.types';
import CurrentUser from '../auth/current-user.decorator';

const hashids = new Hashids(env.HASH_SALT, 16);

@Resolver()
export class UserResolver {
  /**
   * Users list
   */
  @Authorized([UserRole.MEMBER])
  @Query(() => [User])
  async users(): Promise<Array<User>> {
    const users: User[] = await User.findAll({ include: [Role] });

    if (users.length === 0) {
      throw new Error();
    }

    return users;
  }

  /**
   * Get user data
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput, @CurrentUser() currentUser: User): Promise<User> {
    const user = await User.findByPk(where.id, { include: [Role] });

    if (!user || user.blocked) {
      throw Error('The user not found or blocked');
    }

    return user;
  }

  /**
   * Update user data
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => User)
  async updateUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Arg('data') data: UserDataInput,
    @Ctx() ctx: MercuriusContext,
  ): Promise<User> {
    try {
      const user = await User.findByPk(where.id, { include: [Role] });

      if (!user || user.blocked) {
        throw Error('The user not found or blocked');
      }

      const { avatar, ...dataForUpdate } = data;

      // update avatar
      if (avatar) {
        if (user.avatar) {
          await removeFile(ctx.app, user.avatar);
        }

        const avatarName = 'avatar-' + hashids.encode(user.id, Date.now());
        user.avatar = await uploadFile(ctx.app, avatar, 'avatars', avatarName);
      }

      // remove avatar
      if (avatar === null && user.avatar) {
        await removeFile(ctx.app, user.avatar);
        user.avatar = null;
      }

      user.set(dataForUpdate);
      await user.save();

      return user;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Change user password
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Boolean)
  async changeUserPassword(
    @Arg('useOTP') useOTP: boolean,
    @Arg('oldPassword', { nullable: true }) oldPassword: string,
    @Arg('newPassword', { nullable: true }) newPassword: string,
    @Arg('confirmPassword', { nullable: true }) confirmPassword: string,
    @CurrentUser() currentUser: User,
    @Ctx() ctx: MercuriusContext,
  ): Promise<boolean> {
    const user = await User.findOne({
      where: {
        id: currentUser.id,
        blocked: false,
      },
    });

    if (useOTP) {
      user.password = null;
      await user.save();

      return true;
    }

    if (!user.useOTP()) {
      const countUsersWithPassword = await User.count({
        where: {
          [Op.and]: Sequelize.where(
            Sequelize.col('password'),
            verifyPassword(ctx.app.sequelize as Sequelize, 'password', oldPassword),
          ),
        },
      });

      if (countUsersWithPassword === 0) {
        throw Error('Old password is not correct!');
      }

      if (newPassword === confirmPassword) {
        await user.update({ password: newPassword });

        return true;
      } else {
        throw Error('Password mismatch!');
      }
    } else {
      if (newPassword === confirmPassword) {
        await user.update({ password: newPassword });

        return true;
      } else {
        throw Error('Password mismatch!');
      }
    }
  }
}
