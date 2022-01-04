import User from '@entities/user/user.model';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

export enum ConnectedService {
  DISCORD = 'discord',
}

@ObjectType('ConnectedUser')
@Table({ underscored: true })
export default class ConnectedUser extends Model {
  @Field()
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Field()
  @AllowNull(false)
  @Column
  serviceName: ConnectedService;

  @Field()
  @AllowNull(false)
  @Column
  serviceUserId: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Field()
  @Column
  nickname: string;

  @Field()
  @Column
  token: string;

  @Field()
  @Column
  expiresIn: number;

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
