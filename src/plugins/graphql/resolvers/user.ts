/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserRole, User } from '@models/User';
import { MercuriusContext } from 'mercurius';
import { Resolver, Query, Ctx, Authorized } from 'type-graphql';
import CurrentUser from '../decorators/current-user';

@Resolver()
export class UserResolver {
  /**
   * Users list
   */
  @Authorized([UserRole.MEMBER])
  @Query(() => [User])
  async users(@CurrentUser() currentUser: User, @Ctx() ctx: MercuriusContext): Promise<Array<User>> {
    const users: User[] = await User.findAll();

    if (users.length === 0) {
      throw new Error();
    }

    return users;
  }
}
