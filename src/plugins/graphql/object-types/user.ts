/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserRole, User } from '@models/User';
import { MercuriusContext } from 'mercurius';
import {
  Arg,
  Field,
  ObjectType,
  Int,
  Resolver,
  Query,
  Ctx,
  registerEnumType,
  Authorized,
  createUnionType,
} from 'type-graphql';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class AuthObjectType {
  @Field()
  token: string;
}

@ObjectType()
export class ErrorObjectType {
  @Field()
  error: string;
}

const ResultUnionType = createUnionType({
  name: 'ResultUnion',
  types: () => [AuthObjectType, ErrorObjectType] as const,
  resolveType: (value) => {
    if ('token' in value) {
      return AuthObjectType;
    } else {
      return ErrorObjectType;
    }
  },
});

@ObjectType()
export class UserObjectType {
  @Field()
  id: number;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;
}

@Resolver()
export class UserObjectResolver {
  @Query(() => ResultUnionType)
  async signup(@Arg('email') email: string, @Ctx() ctx: MercuriusContext): Promise<typeof ResultUnionType> {
    const user = await User.findOne({
      where: { email },
    });

    if (user === null) {
      ctx.reply.status(400);

      return { error: "User doesn't found" };
    }

    const token = ctx.app.jwt.sign({ id: user.id, role: UserRole.MEMBER });

    return { token };
  }

  @Authorized([UserRole.MEMBER])
  @Query(() => [UserObjectType])
  async users(@Ctx() ctx: MercuriusContext): Promise<Array<UserObjectType>> {
    const users: UserObjectType[] = await User.findAll();

    if (users.length === 0) {
      throw new Error();
    }

    return users;
  }
}
