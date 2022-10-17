import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, ID, InputType } from 'type-graphql';

@InputType('UserSchoolWhereInput')
export class UserSchoolWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => IDFilter, { nullable: true })
  userSkillId?: IDFilter;
}

@InputType('UserSchoolOrderByInput')
export class UserSchoolOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  title?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  startedAt?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  finishedAt?: OrderDirection;
}

@InputType('UserSchoolUpdateInput')
export class UserSchoolUpdateInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => ID, { nullable: true })
  schoolId?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  finishedAt?: Date;
}

@InputType('UserSchoolCreateInput')
export class UserSchoolCreateInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => ID, { nullable: true })
  schoolId?: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  userSkillId: number;

  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  finishedAt?: Date;
}
