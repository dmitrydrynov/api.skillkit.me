import { env } from '@config/env';
import { encryptPassword } from '@helpers/encrypt';
import { generate as generatePassword } from 'generate-password';
import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  Default,
  HasOne,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { TempPassword } from './TempPassword';
import { sendOneTimePassword } from '@services/mailgun';

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  EXPERT = 'expert',
  MEMBER = 'member',
  UNKNOWN = 'unknown',
}

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

  @HasOne(() => TempPassword)
  tempPassword?: TempPassword;

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

  async setOneTimePassword(): Promise<void> {
    const tempPassword = generatePassword({
      exclude: 'abcdefghijklmnopqrstuvwxyz',
      numbers: true,
      length: env.TEMP_PASS_LEN,
      uppercase: false,
    });

    const [userTempPassword, created] = await TempPassword.findOrCreate({
      defaults: { tempPassword },
      where: { userId: this.id },
    });

    if (!created) {
      const now = new Date();
      const expiresOn = now.setMinutes(now.getMinutes() + 2);

      await userTempPassword.update({ expiresOn, tempPassword });
    }

    await sendOneTimePassword(this.email, tempPassword);
  }
}
