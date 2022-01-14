import { env } from '@config/env';
import { authChecker } from '@entities/auth/auth.checker';
import { AuthResolver } from '@entities/auth/auth.resolver';
import { UserRole } from '@entities/user/user.model';
import { UserResolver } from '@entities/user/user.resolver';
import { JWTUserData } from '@entities/user/user.types';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import Mercurius, { MercuriusContext } from 'mercurius';
import { buildSchema } from 'type-graphql';

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
          try {
            const { id, role = UserRole.UNKNOWN }: JWTUserData = fastify.jwt.verify(request.headers['authorization']);

            context.user = {
              id,
              role,
            };
          } catch (error) {
            console.log('[JWT Verify]', error);
          }
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
