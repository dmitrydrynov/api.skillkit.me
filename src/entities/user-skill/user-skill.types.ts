import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum UserSkillLevelEnum {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  SKILLFUL = 'skillful',
  EXPERIENCED = 'experienced',
  EXPERT = 'expert',
}

registerEnumType(UserSkillLevelEnum, {
  name: 'UserSkillLevelEnum',
});

@InputType('UserSkillWhereInput')
export class UserSkillWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  // @Field(() => SkillWhereInput, { nullable: true })
  // AND?: SkillWhereInput;

  // @Field(() => SkillWhereInput, { nullable: true })
  // OR?: SkillWhereInput;

  // @Field(() => SkillWhereInput, { nullable: true })
  // NOT?: SkillWhereInput;
}

@InputType('UserSkillOrderByInput')
export class UserSkillOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  level?: OrderDirection;
}

@InputType('UserSkillUpdateInput')
export class UserSkillUpdateInput {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isDraft?: boolean;

  @Field(() => UserSkillLevelEnum, { nullable: true })
  level?: UserSkillLevelEnum;

  @Field({ nullable: true })
  skillId?: number;
}
