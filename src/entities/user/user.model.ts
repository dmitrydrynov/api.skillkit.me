import { env } from '@config/env';
import { encryptPassword } from '@helpers/encrypt';
import { sendOneTimePassword } from '@services/mailgun';
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
import { Field, ObjectType } from 'type-graphql';
import TempPassword from '../temp-password/temp-password.model';

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  EXPERT = 'expert',
  MEMBER = 'member',
  UNKNOWN = 'unknown',
}

@ObjectType('User')
@Table({ underscored: true })
export default class User extends Model {
  @Field()
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Field()
  @AllowNull(false)
  @IsEmail
  @Column
  email: string;

  @Column
  password?: string;

  @HasOne(() => TempPassword)
  tempPassword?: TempPassword;

  @Field()
  @Column
  firstName?: string;

  @Field()
  @Column
  lastName?: string;

  @Field()
  @Column
  fullName?: string;

  @Field({ nullable: true })
  @Column
  country: string;

  @Field()
  @AllowNull(false)
  @Default(false)
  @Column
  blocked: boolean;

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
