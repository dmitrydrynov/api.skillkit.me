import { encryptPassword } from '@helpers/encrypt';
import {
  AfterCreate,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ underscored: true })
export class TempPassword extends Model {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  tempPassword: string;

  @Column
  expiresOn: Date;

  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt: Date;

  @BeforeUpdate
  static encryptBeforeUpdate(instance: TempPassword): void {
    if (instance.changed('tempPassword')) {
      instance.tempPassword = encryptPassword(this.sequelize, instance.tempPassword);
    }
  }

  @BeforeCreate
  static encryptBeforeCreate(instance: TempPassword): void {
    // if (instance.changed('tempPassword')) {
    instance.tempPassword = encryptPassword(this.sequelize, instance.tempPassword);
    // }

    console.log('MODEL', instance);
  }

  @AfterCreate
  @AfterUpdate
  static async recovery(instance: TempPassword): Promise<void> {
    instance.tempPassword = undefined;
  }
}
