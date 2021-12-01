import { DirectiveLocation, GraphQLDirective, GraphQLEnumType, GraphQLFieldConfig, GraphQLList } from 'graphql';

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  PARTNER = 'partner',
  USER = 'user',
  UNKNOWN = 'unknown',
}

const userRoleType = new GraphQLEnumType({
  name: 'UserRole',
  values: Object.values(UserRole).reduce(
    (carry, userRole) => ({
      ...carry,
      [userRole]: { value: UserRole[userRole] },
    }),
    {},
  ),
});

export const authDirective = new GraphQLDirective({
  name: 'auth',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    roles: {
      type: GraphQLList(userRoleType),
      defaultValue: [UserRole.UNKNOWN],
    },
  },
});

export function requireAuthorization(
  field: GraphQLFieldConfig<string, unknown>,
  role: UserRole | UserRole[],
): GraphQLFieldConfig<string, unknown> {
  const roles = Array.isArray(role) ? role : [role];

  return {
    ...field,
    astNode: {
      ...field.astNode,
      directives: [
        ...(field.astNode?.directives ?? []),
        {
          kind: 'Directive',
          name: {
            kind: 'Name',
            value: 'auth',
          },
          arguments: [
            {
              kind: 'Argument',
              name: {
                kind: 'Name',
                value: 'roles',
              },
              value: {
                kind: 'ListValue',
                values: roles.map((role) => ({
                  kind: 'StringValue',
                  value: role,
                })),
              },
            },
          ],
        },
      ],
    },
  };
}
