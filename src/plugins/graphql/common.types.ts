import { Field, ObjectType } from 'type-graphql';

@ObjectType('DefaultResponseType')
export class DefaultResponseType {
  @Field()
  result: boolean;
}
