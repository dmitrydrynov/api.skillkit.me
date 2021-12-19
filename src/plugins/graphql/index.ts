import { env } from '@config/env';
import { UserRole } from '@models/User';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import Mercurius, { MercuriusContext } from 'mercurius';
import { buildSchema } from 'type-graphql';
import { authChecker } from './auth-checker';
import { JWTUserData } from './odt/user.types';
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
      context: (request: FastifyRequest, reply: FastifyReply) => {
        const context: Partial<MercuriusContext> = { reply, user: null };

        if (request.headers['authorization']) {
          const { id, role = UserRole.UNKNOWN }: JWTUserData = fastify.jwt.verify(request.headers['authorization']);

          context.user = {
            id,
            role,
          };
        }

        return context;
      },
    });
  },
  {
    name: 'graphql',
    dependencies: ['sequelize'],
  },
);

declare module 'mercurius' {
  interface MercuriusContext {
    user: JWTUserData;
  }
}
