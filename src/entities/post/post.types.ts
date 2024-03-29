/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter } from '@plugins/graphql/types/common.types';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

export enum PostViewModeEnum {
  ONLY_ME = 'only_me',
  BY_LINK = 'by_link',
  EVERYONE = 'everyone',
}

@InputType('PostWhereInput')
export class PostWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  slug?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  viewMode?: StringFilter;

  @Field(() => Boolean, { nullable: true })
  isDraft?: boolean;

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
  @Field({ nullable: true })
  slug?: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => ID, { nullable: true })
  authorId?: number;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  featureImage?: string;
}

@InputType('PostUpdateInput')
export class PostUpdateInput {
  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => ID, { nullable: true })
  authorId?: number;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  viewMode?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  featureImage?: string;
}

@ObjectType('PostAuthorField')
export class PostAuthorField {
  @Field()
  id: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  age?: number;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  email?: string;
}

@InputType('PostWhereUniqueInput')
export class PostWhereUniqueInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  slug?: string;
}

@ObjectType('UploadPostImageResponse')
export class UploadPostImageResponse {
  @Field()
  url: string;

  @Field()
  width: number;

  @Field()
  height: number;
}
