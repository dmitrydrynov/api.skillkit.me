import { Field, ObjectType } from 'type-graphql';

@ObjectType('HealthReponse')
export class HealthReponseType {
  @Field()
  healthy: boolean;
  error?: string;
}
