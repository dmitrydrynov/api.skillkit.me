import { createUnionType, Field, ObjectType } from 'type-graphql';

@ObjectType('SignInResponse')
export class SignInResponseType {
  @Field()
  hasOneTimePassword: boolean;
}

@ObjectType('AuthTokenResponse')
export class AuthTokenResponseType {
  @Field()
  token: string;
}

@ObjectType('AuthNextResponse')
export class AuthNextResponseType {
  @Field()
  next: boolean;
}

export const AuthResponseType = createUnionType({
  name: 'AuthResponse', // the name of the GraphQL union
  types: () => [AuthNextResponseType, AuthTokenResponseType] as const, // function that returns tuple of object types classes
  resolveType: (value) => {
    if ('next' in value) {
      return 'AuthNextResponse';
    }

    if ('token' in value) {
      return 'AuthTokenResponse';
    }

    return undefined;
  },
});
