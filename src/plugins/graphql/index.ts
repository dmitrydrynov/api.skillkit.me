import { env } from '@config/env';
import { UserRole } from './helpers/authorize';
import fp from 'fastify-plugin';
import Mercurius, { MercuriusContext } from 'mercurius';
import { buildSchema, ResolverData } from 'type-graphql';
import { UserResolver } from './fields/user';

export default fp(
  async (fastify) => {
    const schema = await buildSchema({
      resolvers: [UserResolver],
      authChecker: ({ args, context }: ResolverData<MercuriusContext>, roles: string[]) => {
        try {
          const { id, role = UserRole.UNKNOWN }: { id: number; role: UserRole } = context.app.jwt.verify(
            context.reply.request.headers['authorization'],
          );

          // check auth user

          return true;
        } catch (exception) {
          context.app.log.debug('Exception');
          context.app.log.error(exception);

          return false;
        }
      },
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
