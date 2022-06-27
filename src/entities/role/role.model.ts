import User, { UserRole } from '@entities/user/user.model';
import { AllowNull, AutoIncrement, Column, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType('Role')
@Table({ underscored: true, timestamps: false })
export default class Role extends Model {
  @Field()
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Field()
  @AllowNull(false)
  @Column
  name: UserRole;

  @HasMany(() => User)
  users: User[];
}
