/* eslint-disable @typescript-eslint/no-unused-vars */
import { MercuriusContext } from 'mercurius';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { User, UserRole } from './user.model';
import CurrentUser from '../auth/current-user.decorator';

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
