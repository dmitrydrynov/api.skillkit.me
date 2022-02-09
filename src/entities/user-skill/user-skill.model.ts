import Skill from '@entities/skill/skill.model';
import User from '@entities/user/user.model';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserSkillLevelEnum } from './user-skill.types';

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  EXPERT = 'expert',
  MEMBER = 'member',
  UNKNOWN = 'unknown',
}

@ObjectType('UserSkill')
@Table({ underscored: true })
export default class UserSkill extends Model {
  @Field(() => ID)
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Field(() => User)
  async user() {
    return await User.findByPk(this.userId);
  }

  @ForeignKey(() => Skill)
  @Column
  skillId: number;

  @Field(() => Skill)
  async skill() {
    return await Skill.findByPk(this.skillId);
  }

  @Field(() => UserSkillLevelEnum)
  @Column
  level: UserSkillLevelEnum;

  @Field()
  @AllowNull(false)
  @Default(true)
  @Column
  isDraft: boolean;

  @Field(() => ID, { nullable: true })
  @Column
  initialId: number;

  @Field({ nullable: true })
  @Column
  description?: string;

  @Field({ nullable: true })
  @Column
  publishedAt: Date;

  @Field()
  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt: Date;

  @Field()
  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt: Date;
}
