/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyContext } from 'fastify';
import { MercuriusContext } from 'mercurius';
import {
  Arg,
  Field,
  ObjectType,
  Int,
  Resolver,
  Query,
  Ctx,
  Directive,
  registerEnumType,
  Authorized,
} from 'type-graphql';

enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  PARTNER = 'partner',
  USER = 'user',
  UNKNOWN = 'unknown',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType({ description: 'Object representing cooking recipe' })
export class User {
  @Field()
  title: string;

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Use `description` field instead',
  })
  get specification(): string | undefined {
    return this.description;
  }

  @Field({
    nullable: true,
    description: 'The recipe description with preparation info',
  })
  description?: string;

  @Field(() => [Int])
  ratings: number[];

  @Field()
  creationDate: Date;
}

@Resolver()
export class UserResolver {
  @Authorized('ADMIN')
  @Query(() => User, { nullable: true })
  async user(
    @Arg('title') title: string,
    @Ctx() ctx: MercuriusContext,
  ): Promise<Omit<User, 'specification'> | undefined> {
    return {
      description: 'Desc 1',
      title: 'User 1',
      ratings: [0, 3, 1],
      creationDate: new Date('2018-04-11'),
    };
  }
}
