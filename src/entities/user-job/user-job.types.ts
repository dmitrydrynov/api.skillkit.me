import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

@InputType('UserJobWhereInput')
export class UserJobWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => IDFilter, { nullable: true })
  userCompanyId?: IDFilter;

  @Field(() => IDFilter, { nullable: true })
  userSkillId?: IDFilter;
}

@InputType('UserJobOrderByInput')
export class UserJobOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  startedAt?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  finishedAt?: OrderDirection;
}

@InputType('UserJobUpdateInput')
export class UserJobUpdateInput {
  @Field({ nullable: true })
  companyName: string;

  @Field({ nullable: true })
  position: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  finishedAt?: Date;
}

@InputType('UserJobCreateInput')
export class UserJobCreateInput {
  @Field()
  companyName: string;

  @Field()
  position: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  userSkillId: number;

  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  finishedAt?: Date;
}

@ObjectType('ExperienceResponse')
export class ExperienceResponse {
  @Field()
  years: number;

  @Field()
  months: number;
}
