/* eslint-disable @typescript-eslint/no-unused-vars */
import { MercuriusContext } from 'mercurius';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import User, { UserRole } from './user.model';
import { UserWhereUniqueInput } from './user.types';
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
}
