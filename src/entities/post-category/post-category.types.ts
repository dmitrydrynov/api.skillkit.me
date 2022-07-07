/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

@InputType('PostCategoryWhereInput')
export class PostCategoryWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  slug?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  // @Field(() => PostCategoryWhereInput, { nullable: true })
  // AND?: PostCategoryWhereInput;

  // @Field(() => PostCategoryWhereInput, { nullable: true })
  // OR?: PostCategoryWhereInput;

  // @Field(() => PostCategoryWhereInput, { nullable: true })
  // NOT?: PostCategoryWhereInput;
}

@InputType('PostCategoryOrderByInput')
export class PostCategoryOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  slug?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  name?: OrderDirection;
}
