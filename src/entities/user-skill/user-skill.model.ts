import { env } from '@config/env';
import ConnectedUser from '@entities/connected-users/connected-user.model';
import Role from '@entities/role/role.model';
import Skill from '@entities/skill/skill.model';
import User from '@entities/user/user.model';
import { encryptPassword } from '@helpers/encrypt';
import { sendOneTimePassword } from '@services/mailgun';
import { generate as generatePassword } from 'generate-password';
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
import { Field, ObjectType } from 'type-graphql';
import TempPassword from '../temp-password/temp-password.model';

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
  @Field()
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Skill)
  @Column
  skillId: number;

  // @Field()
  // async user(): Promise<User> {
  //   if (!this.userId) {
  //     return Promise.resolve(null);
  //   }

  //   return User.findByPk(this.userId);
  // }

  @Field()
  @AllowNull(false)
  @Default(true)
  @Column
  isDraft: boolean;

  @Field()
  @Column
  initialId: number;

  @Field()
  @AllowNull(false)
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
