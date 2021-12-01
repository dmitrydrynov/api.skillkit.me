import { encryptPassword } from '@helpers/encrypt';
import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  Default,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ underscored: true })
export class User extends Model {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @IsEmail
  @Column
  email: string;

  @Column
  password?: string;

  @Column
  firstName?: string;

  @Column
  lastName?: string;

  @Column
  fullName?: string;

  @Column
  country: string;

  @AllowNull(false)
  @Default(false)
  @Column
  blocked: boolean;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt: Date;

  @BeforeCreate
  @BeforeUpdate
  static encrypt(instance: User): void {
    if (instance.changed('password')) {
      instance.password = encryptPassword(this.sequelize, instance.password);
    }
  }
}
