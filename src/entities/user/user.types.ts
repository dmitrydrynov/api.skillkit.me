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
