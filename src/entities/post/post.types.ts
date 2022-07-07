/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter } from '@plugins/graphql/types/common.types';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

@InputType('PostWhereInput')
export class PostWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  slug?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  // @Field(() => PostWhereInput, { nullable: true })
  // AND?: PostWhereInput;

  // @Field(() => PostWhereInput, { nullable: true })
  // OR?: PostWhereInput;

  // @Field(() => PostWhereInput, { nullable: true })
  // NOT?: PostWhereInput;
}

@InputType('PostOrderByInput')
export class PostOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  slug?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  title?: OrderDirection;
}

@InputType('PostCreateInput')
export class PostCreateInput {
  @Field()
  slug: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => ID, { nullable: true })
  authorId?: number;

  @Field({ nullable: true })
  categoryId?: number;
}

@ObjectType('PostAuthorField')
export class PostAuthorField {
  @Field()
  id: string;

  @Field()
  fullName: string;

  @Field()
  age?: number;

  @Field()
  avatar?: string;

  @Field()
  email?: string;
}
