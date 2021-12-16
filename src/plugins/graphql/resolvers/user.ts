/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserRole, User } from '@models/User';
import { MercuriusContext } from 'mercurius';
import { Field, ObjectType, Resolver, Query, Ctx, registerEnumType, Authorized } from 'type-graphql';
import CurrentUser from '../decorators/current-user';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType('User')
export class UserObjectType {
  @Field()
  id: number;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field()
  country?: string;
}

@Resolver()
export class UserResolver {
  /**
   * Users list
   */
  @Authorized([UserRole.MEMBER])
  @Query(() => [UserObjectType])
  async users(@CurrentUser() currentUser: User, @Ctx() ctx: MercuriusContext): Promise<Array<UserObjectType>> {
    const users: UserObjectType[] = await User.findAll();

    console.log('currentUser', currentUser, ctx.user);

    if (users.length === 0) {
      throw new Error();
    }

    return users;
  }
}
