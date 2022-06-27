import User from '@entities/user/user.model';
import { Field, ObjectType, createUnionType } from 'type-graphql';

@ObjectType('HealthReponse')
export class HealthReponseType {
  @Field()
  healthy: boolean;
}
