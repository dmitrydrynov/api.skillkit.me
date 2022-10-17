/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

@InputType('SchoolWhereInput')
export class SchoolWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  // @Field(() => SchoolWhereInput, { nullable: true })
  // AND?: SchoolWhereInput;

  // @Field(() => SchoolWhereInput, { nullable: true })
  // OR?: SchoolWhereInput;

  // @Field(() => SchoolWhereInput, { nullable: true })
  // NOT?: SchoolWhereInput;
}

@InputType('SchoolOrderByInput')
export class SchoolOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  name?: OrderDirection;
}
