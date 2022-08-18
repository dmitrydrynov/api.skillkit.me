import { PostWhereInput } from '@entities/post/post.types';
import { SkillWhereInput } from '@entities/skill/skill.types';
import { UserJobWhereInput } from '@entities/user-job/user-job.types';
import { UserSchoolWhereInput } from '@entities/user-school/user-school.types';
import { UserSkillWhereInput } from '@entities/user-skill/user-skill.types';
import { UserToolWhereInput } from '@entities/user-tool/user-tool.types';
import { Field, GraphQLISODateTime, ID, InputType, ObjectType, registerEnumType } from 'type-graphql';

export type CommonWhere =
  | WhereUniqueInput
  | SkillWhereInput
  | UserToolWhereInput
  | UserSchoolWhereInput
  | UserJobWhereInput
  | UserSkillWhereInput
  | PostWhereInput;

@ObjectType('DefaultResponseType')
export class DefaultResponseType {
  @Field()
  result: boolean;
}

@InputType('IDFilter')
export class IDFilter {
  @Field(() => ID, { nullable: true })
  equals?: number;

  @Field(() => [ID], { nullable: true })
  in?: number[];

  @Field(() => [ID], { nullable: true })
  notIn?: number[];

  @Field(() => ID, { nullable: true })
  lt?: number;

  @Field(() => ID, { nullable: true })
  lte?: number;

  @Field(() => ID, { nullable: true })
  gt?: number;

  @Field(() => ID, { nullable: true })
  gte?: number;

  @Field(() => ID, { nullable: true })
  not?: number;
}

@InputType('StringFilter')
export class StringFilter {
  @Field(() => String, { nullable: true })
  equals?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];

  @Field(() => String, { nullable: true })
  lt?: string;

  @Field(() => String, { nullable: true })
  lte?: string;

  @Field(() => String, { nullable: true })
  gt?: string;

  @Field(() => String, { nullable: true })
  gte?: string;

  @Field(() => String, { nullable: true })
  contains: string;

  @Field(() => String, { nullable: true })
  startsWith: string;

  @Field(() => String, { nullable: true })
  endsWith: string;

  @Field(() => QueryMode, { nullable: true })
  mode: QueryMode;

  @Field(() => String, { nullable: true })
  not?: string;
}

@InputType('DateTimeFilter')
export class DateTimeFilter {
  @Field(() => GraphQLISODateTime, { nullable: true })
  equals?: Date;

  @Field(() => [GraphQLISODateTime], { nullable: true })
  in?: Date[];

  @Field(() => [GraphQLISODateTime], { nullable: true })
  notIn?: Date[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  lt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  lte?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  gt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  gte?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  not?: Date;
}

export enum QueryMode {
  default,
  insensitive,
}

registerEnumType(QueryMode, {
  name: 'QueryMode',
});

export enum OrderDirection {
  asc = 'ASC',
  desc = 'DESC',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

@InputType('WhereUniqueInput')
export class WhereUniqueInput {
  @Field(() => ID)
  id: number;
}
