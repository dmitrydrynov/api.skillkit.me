import { env } from '@config/env';
import { UserRole } from '@models/User';
import fp from 'fastify-plugin';
import Mercurius from 'mercurius';
import { buildSchema } from 'type-graphql';
import { authChecker } from './helpers/auth-checker';
import { UserObjectResolver } from './object-types/user';

export default fp(
  async (fastify) => {
    const schema = await buildSchema({
      resolvers: [UserObjectResolver],
      authChecker,
    });

    fastify.register(Mercurius, {
      schema,
      graphiql: env.NODE_ENV === 'development',
    });
  },
  {
    name: 'graphql',
    dependencies: ['sequelize'],
  },
);

declare module 'mercurius' {
  interface MercuriusContext {
    user: {
      firstName: string;
      lastName: string;
      fullName: string;
      roles: UserRole[];
    };
  }
}
