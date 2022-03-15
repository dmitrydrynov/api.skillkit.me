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

export enum UserFileType {
  FILE = 'file',
  LINK = 'link',
}

export const getUserFileType = (type: string): UserFileType => {
  switch (type) {
    case 'file':
      return UserFileType.FILE;
    case 'link':
      return UserFileType.LINK;
  }
};

@ObjectType('UserFile')
@Table({ underscored: true })
export default class UserFile extends Model {
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

  @Field()
  @Column
  title: string;

  @Field(() => UserFileType)
  @Column
  type: UserFileType;

  @Field()
  @Column
  url: string;

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
