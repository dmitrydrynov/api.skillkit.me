import UserSkill from '@entities/user-skill/user-skill.model';
import User from '@entities/user/user.model';
import { DateTime } from 'luxon';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import { ExperienceResponse } from './user-job.types';

@ObjectType('UserJob')
@Table({ underscored: true })
export default class UserJob extends Model {
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

  @ForeignKey(() => UserSkill)
  @Column
  userSkillId: number;

  @BelongsTo(() => UserSkill)
  userSkillItem: UserSkill;

  @Field(() => UserSkill)
  async userSkill() {
    return await this.getUserSkillItem();
  }

  @Field()
  @Column
  title: string;

  @Field()
  @Column
  position: string;

  @Field({ nullable: true })
  @Column
  description?: string;

  @Field()
  @AllowNull(false)
  @Column
  startedAt: Date;

  @Field({ nullable: true })
  @Column
  finishedAt?: Date;

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

  @Field(() => ExperienceResponse, { nullable: true })
  experience() {
    const start = DateTime.fromJSDate(this.startedAt);
    const finish = this.finishedAt ? DateTime.fromJSDate(this.finishedAt) : DateTime.now();

    const diff = finish.diff(start, ['years', 'months']);
    const diffObj = diff.toObject();

    return { years: Math.round(diffObj.years), months: Math.round(diffObj.months) };
  }
}
