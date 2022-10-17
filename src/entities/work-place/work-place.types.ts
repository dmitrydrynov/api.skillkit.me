/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

@InputType('WorkPlaceWhereInput')
export class WorkPlaceWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  // @Field(() => WorkPlaceWhereInput, { nullable: true })
  // AND?: WorkPlaceWhereInput;

  // @Field(() => WorkPlaceWhereInput, { nullable: true })
  // OR?: WorkPlaceWhereInput;

  // @Field(() => WorkPlaceWhereInput, { nullable: true })
  // NOT?: WorkPlaceWhereInput;
}

@InputType('WorkPlaceOrderByInput')
export class WorkPlaceOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  name?: OrderDirection;
}
