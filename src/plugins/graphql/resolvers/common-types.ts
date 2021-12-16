import { createUnionType, Field, ObjectType } from 'type-graphql';

@ObjectType('DefaultResultResponse')
export class DefaultResultObjectType {
  @Field()
  result: boolean;
}

@ObjectType('DefaultErrorResponse')
export class DefaultErrorObjectType {
  @Field()
  error: string;
}

export const DefaultResponseType = createUnionType({
  name: 'SignUpResponse',
  types: () => [DefaultResultObjectType, DefaultErrorObjectType] as const,
  resolveType: (value) => {
    if ('error' in value) {
      return DefaultErrorObjectType;
    } else {
      return DefaultResultObjectType;
    }
  },
});
