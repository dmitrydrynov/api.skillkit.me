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
import { UserToolLevelEnum } from './user-tool.types';

@ObjectType('UserTool')
@Table({ underscored: true })
export default class UserTool extends Model {
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

  @Field(() => UserToolLevelEnum)
  @Column
  level: UserToolLevelEnum;

  @Field({ nullable: true })
  @Column
  description?: string;

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
