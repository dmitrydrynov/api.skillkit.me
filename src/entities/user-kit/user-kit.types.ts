import { ProfessionWhereInput } from '@entities/profession/profession.types';
import { SkillWhereInput } from '@entities/skill/skill.types';
import UserJob from '@entities/user-job/user-job.model';
import UserSchool from '@entities/user-school/user-school.model';
import User from '@entities/user/user.model';
import { DateTimeFilter, IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';
import UserKit from './user-kit.model';

export enum UserKitViewModeEnum {
  ONLY_ME = 'only_me',
  BY_LINK = 'by_link',
  EVERYONE = 'everyone',
}

registerEnumType(UserKitViewModeEnum, {
  name: 'UserKitViewModeEnum',
});

@InputType('UserKitWhereInput')
export class UserKitWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field({ nullable: true })
  isDraft?: boolean;

  @Field(() => SkillWhereInput, { nullable: true })
  profession?: ProfessionWhereInput;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;
}

@InputType('UserKitOrderByInput')
export class UserKitOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  createdAt?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  updatedAt?: OrderDirection;
}

@InputType('UserKitUpdateInput')
export class UserKitUpdateInput {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isDraft?: boolean;

  @Field({ nullable: true })
  professionId?: number;

  @Field({ nullable: true })
  professionName?: string;

  @Field(() => UserKitViewModeEnum, { nullable: true })
  viewMode?: UserKitViewModeEnum;
}

@ObjectType('UserKitForShareResponse')
export class UserKitForShareResponseType {
  @Field(() => UserKit)
  userKit: UserKit;

  @Field()
  viewer: string;

  @Field(() => User)
  user: User;
}

@ObjectType('UserKitsForShareResponse')
export class UserKitsForShareResponseType {
  @Field()
  url: string;

  @Field({ nullable: true })
  skillName?: string;

  @Field()
  userName: string;

  @Field()
  updatedAt: Date;
}

@ObjectType('UserSchoolsForKitResponse')
export class UserSchoolsForKitResponseType {
  @Field(() => ID)
  schoolId: number;

  @Field()
  name: string;

  @Field(() => [UserSchool])
  userSchools: UserSchool[];
}

@ObjectType('UserJobsForKitResponse')
export class UserJobsForKitResponseType {
  @Field(() => ID)
  workPlaceId: number;

  @Field()
  name: string;

  @Field()
  experience: number;

  @Field(() => [UserJob])
  userJobs: UserJob[];
}
