/* eslint-disable @typescript-eslint/no-unused-vars */
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import { MercuriusContext } from 'mercurius';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import User, { UserRole } from './user.model';
import { UserDataInput, UserWhereUniqueInput } from './user.types';
import CurrentUser from '../auth/current-user.decorator';

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
    const uploadData = await data.avatar;
    const { filename, createReadStream } = uploadData as unknown as FileUpload;

    const uploadingResponse = new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `/../../storage/avatars/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    const uploaded = await uploadingResponse;

    if (await uploadingResponse) {
      // get url
    }

    const user = await User.findByPk(where.id);

    if (!user || user.blocked) {
      throw Error('The user not found or blocked');
    }

    await user.update({ ...data });

    return user;
  }
}
