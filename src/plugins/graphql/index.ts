import { env } from '@config/env';
import { UserRole, authDirective } from './helpers/authorize';
// import generateField from '@helpers/graphql/field_generator';
// import { User } from '@models/User';
import fp from 'fastify-plugin';
import { GraphQLInt, GraphQLObjectType, GraphQLSchema, ListValueNode, StringValueNode } from 'graphql';
// import { attributeFields } from "graphql-sequelize";
import Mercurius from 'mercurius';
import MercuriusAuth from 'mercurius-auth';
import { User } from '@models/User';
// import { getRegisteredUserById } from "./fields/role_based/user";

export default fp(
  async (fastify) => {
    const queriesType = new GraphQLObjectType({
      fields: {
        add: {
          args: {
            x: { type: GraphQLInt },
            y: { type: GraphQLInt },
          },
          type: new GraphQLObjectType({
            name: 'addType',
            fields: { sum: { type: GraphQLInt } },
          }),
          async resolve(source: unknown, { x, y }: any) {
            const user = await User.findAll();
            console.log(user);

            return { sum: parseInt(x) + parseInt(y) };
          },
        },
        // getProfile: requireAuthorization(getProfileField, [
        //   UserRole.ADMIN,
        //   UserRole.OPERATOR,
        //   UserRole.PARTNER,
        //   UserRole.USER,
        // ]),
        // userWallets: requireAuthorization(
        //   generateField(UserWallet, {
        //     description: 'Get all users crypto wallets',
        //     listing: true,
        //     attributes: {
        //       additional: {
        //         cryptoCurrency: { type: cryptoCurrencyType },
        //       },
        //       exclude: ['userId'],
        //     },
        //     before: beforeUserWalletsFieldResolve,
        //   }),
        //   UserRole.USER,
        // ),
      },
      name: 'Query',
    });

    // const mutationsType = new GraphQLObjectType({
    //     fields: {
    //         signUp: signUpField,
    //         signIn: signInField,
    //         editProfile: requireAuthorization(editProfileField, [UserRole.ADMIN, UserRole.OPERATOR, UserRole.PARTNER]),
    //     },
    //     name: 'Mutation',
    // });

    const schema = new GraphQLSchema({
      directives: [authDirective],
      // mutation: mutationsType,
      query: queriesType,
    });

    fastify.register(Mercurius, {
      schema,
      graphiql: env.NODE_ENV === 'development',
    });
    fastify.register(MercuriusAuth, {
      authDirective: 'auth',
      async authContext(context) {
        const { app, reply } = context;

        try {
          const { id, role = UserRole.UNKNOWN }: { id: number; role: UserRole } = app.jwt.verify(
            reply.request.headers['authorization'],
          );

          // const user = await getRegisteredUserById(id, role);

          // if (user?.blocked ?? true) {
          //     return { role: UserRole.UNKNOWN };
          // }

          return { id, role };
        } catch (exception) {
          return { role: UserRole.UNKNOWN };
        }
      },
      async applyPolicy(ast, parent, args, context) {
        const argument = ast.arguments.find((argument) => argument.name.value === 'roles');

        const { values: roles = [] } = (argument?.value as ListValueNode) ?? {};

        return roles.map((role: StringValueNode) => role.value).includes(context.auth.role);
      },
    });
  },
  {
    name: 'graphql',
    dependencies: ['sequelize'],
  },
);
