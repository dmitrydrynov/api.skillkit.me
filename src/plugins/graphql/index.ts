import { env } from '@config/env';
import { authChecker } from '@entities/auth/auth.checker';
import { AuthResolver } from '@entities/auth/auth.resolver';
import { SkillResolver } from '@entities/skill/skill.resolver';
import { UserJobResolver } from '@entities/user-job/user-job.resolver';
import { UserSchoolResolver } from '@entities/user-school/user-school.resolver';
import { UserSkillResolver } from '@entities/user-skill/user-skill.resolver';
import { UserToolResolver } from '@entities/user-tool/user-tool.resolver';
import { UserRole } from '@entities/user/user.model';
import { UserResolver } from '@entities/user/user.resolver';
import { JWTUserData } from '@entities/user/user.types';
import AltairFastify from 'altair-fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import Mercurius, { MercuriusContext } from 'mercurius';
import MercuriusGQLUpload from 'mercurius-upload';
import { buildSchema } from 'type-graphql';

export default fp(
  async (fastify) => {
    const schema = await buildSchema({
      resolvers: [
        AuthResolver,
        UserResolver,
        SkillResolver,
        UserSkillResolver,
        UserToolResolver,
        UserSchoolResolver,
        UserJobResolver,
      ],
      authChecker,
    });

    fastify.register(MercuriusGQLUpload, {
      // options passed to processRequest from graphql-upload
    });

    fastify.register(Mercurius, {
      schema,
      graphiql: false,
      ide: false,
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

    if (env.ALTAIR_ENABLED) {
      fastify.register(AltairFastify, {
        path: '/altair',
        baseURL: '/altair/',
        endpointURL: '/graphql',
      });
    }
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
