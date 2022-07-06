import User from '@entities/user/user.model';
import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import UserSkill from './user-skill.model';

export enum UserSkillLevelEnum {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  SKILLFUL = 'skillful',
  EXPERIENCED = 'experienced',
  EXPERT = 'expert',
}

export enum UserSkillViewModeEnum {
  ONLY_ME = 'only_me',
  BY_LINK = 'by_link',
  EVERYONE = 'everyone',
}

registerEnumType(UserSkillLevelEnum, {
  name: 'UserSkillLevelEnum',
});

registerEnumType(UserSkillViewModeEnum, {
  name: 'UserSkillViewModeEnum',
});

@InputType('UserSkillWhereInput')
export class UserSkillWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field({ nullable: true })
  isDraft?: boolean;

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

  @Field({ nullable: true })
  skillName?: string;

  @Field(() => UserSkillViewModeEnum, { nullable: true })
  viewMode?: UserSkillViewModeEnum;
}

@ObjectType('UserSkillForShareResponse')
export class UserSkillForShareResponseType {
  @Field(() => UserSkill)
  skill: UserSkill;

  @Field()
  viewer: string;

  @Field(() => User)
  user: User;
}
