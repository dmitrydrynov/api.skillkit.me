/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDFilter, OrderDirection, StringFilter, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

@InputType('SkillWhereInput')
export class SkillWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  // @Field(() => SkillWhereInput, { nullable: true })
  // AND?: SkillWhereInput;

  // @Field(() => SkillWhereInput, { nullable: true })
  // OR?: SkillWhereInput;

  // @Field(() => SkillWhereInput, { nullable: true })
  // NOT?: SkillWhereInput;
}

@InputType('SkillOrderByInput')
export class SkillOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  name?: OrderDirection;
}
