import UserSkill from '@entities/user-skill/user-skill.model';
import User from '@entities/user/user.model';
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

@ObjectType('UserSchool')
@Table({ underscored: true })
export default class UserSchool extends Model {
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
}
