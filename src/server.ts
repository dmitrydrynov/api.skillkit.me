import '@config/env';
import { env } from '@config/env';
import Fastify, { FastifyInstance } from 'fastify';
import { default as JWT } from 'fastify-jwt';

const fastify: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  trustProxy: true,
  logger: {
    level: 'debug',
    prettyPrint: true,
  },
});

fastify.register(JWT, {
  secret: env.JWT_SECRET,
  verify: { maxAge: env.TOKEN_TTL },
});

fastify.register(import('./plugins'));

const start = async () => {
  try {
    await fastify.listen(env.PORT, env.HOST);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
