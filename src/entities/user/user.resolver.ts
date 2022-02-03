/* eslint-disable @typescript-eslint/no-unused-vars */
import { createWriteStream } from 'fs';
import path from 'path';
import { env } from '@config/env';
import { removeFile, uploadFile } from '@helpers/file';
import Hashids from 'hashids';
import { MercuriusContext } from 'mercurius';
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
  @Query(() => [User], { description: 'Get users list' })
  async users(@CurrentUser() currentUser: User, @Ctx() ctx: MercuriusContext): Promise<Array<User>> {
    const users: User[] = await User.findAll();

    if (users.length === 0) {
      throw new Error();
    }

    return users;
  }

  /**
   * Get user data
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => User, { description: 'Get user data by ID' })
  async user(@Arg('where') where: UserWhereUniqueInput, @CurrentUser() currentUser: User): Promise<User> {
    const user = await User.findByPk(where.id);

    if (!user || user.blocked) {
      throw Error('The user not found or blocked');
    }

    return user;
  }

  /**
   * Update user data
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => User, { description: 'Get user data by ID' })
  async updateUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Arg('data') data: UserDataInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    try {
      const user = await User.findByPk(where.id);

      if (!user || user.blocked) {
        throw Error('The user not found or blocked');
      }

      user.set({ ...data, avatar: null });

      if (data.avatar) {
        if (user.avatar) {
          await removeFile(user.avatar);
        }

        const avatarName = 'avatar-' + hashids.encode(user.id, Date.now());
        user.avatar = await uploadFile(data.avatar, 'avatars', avatarName);
      }

      await user.save();

      return user;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
