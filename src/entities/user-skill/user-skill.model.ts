import JuncUserSkillFile from '@entities/junc-user-skill-file/junc-user-skill-file.model';
import Skill from '@entities/skill/skill.model';
import UserFile from '@entities/user-file/user-file.model';
import UserTool from '@entities/user-tool/user-tool.model';
import User from '@entities/user/user.model';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  HasMany,
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
  [x: string]: any;
  @Field(() => ID)
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  userItem: User;

  @Field(() => User)
  async user() {
    return await this.getUserItem();
  }

  @ForeignKey(() => Skill)
  @Column
  skillId: number;

  @BelongsTo(() => Skill)
  skillItem: Skill;

  @Field(() => Skill)
  async skill() {
    return await this.getSkillItem();
  }

  @Field(() => UserSkillLevelEnum)
  @Column
  level: UserSkillLevelEnum;

  @HasMany(() => UserTool)
  userToolItems: UserTool[];

  @Field(() => [UserTool])
  async userTools() {
    return await this.getUserToolItems();
  }

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

  @BelongsToMany(() => UserFile, () => JuncUserSkillFile)
  userFiles: UserFile[];
}
