import { env } from '@config/env';
import { UserRole } from '@models/User';
import fp from 'fastify-plugin';
import Mercurius from 'mercurius';
import { buildSchema } from 'type-graphql';
import { authChecker } from './auth-checker';
import { AuthResolver } from './resolvers/auth';
import { UserResolver } from './resolvers/user';

export default fp(
  async (fastify) => {
    const schema = await buildSchema({
      resolvers: [AuthResolver, UserResolver],
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
