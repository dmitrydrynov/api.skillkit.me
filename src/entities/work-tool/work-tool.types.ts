/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

@InputType('WorkToolWhereInput')
export class WorkToolWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  // @Field(() => WorkToolWhereInput, { nullable: true })
  // AND?: WorkToolWhereInput;

  // @Field(() => WorkToolWhereInput, { nullable: true })
  // OR?: WorkToolWhereInput;

  // @Field(() => WorkToolWhereInput, { nullable: true })
  // NOT?: WorkToolWhereInput;
}

@InputType('WorkToolOrderByInput')
export class WorkToolOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  name?: OrderDirection;
}
