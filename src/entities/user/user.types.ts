/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLUpload, Upload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';
import { UserRole } from './user.model';

export class JWTUserData {
  id: number;
  firstName?: string;
  lastName?: string;
  country?: string;
  email?: string;
  role?: UserRole;
}

@InputType('UserWhereUniqueInput')
export class UserWhereUniqueInput {
  @Field()
  id: number;
}

@InputType('UserDataInput')
export class UserDataInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  birthdayDate?: Date;

  @Field(() => GraphQLUpload, { nullable: true })
  avatar?: Upload;

  @Field({ nullable: true })
  about?: string;
}
