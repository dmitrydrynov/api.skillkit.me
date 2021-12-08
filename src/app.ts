import { join } from 'path';
import { env } from '@config/env';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';
import { default as JWT } from 'fastify-jwt';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // Register JWT
  fastify.register(JWT, {
    secret: env.JWT_SECRET,
    verify: { maxAge: env.TOKEN_TTL },
  });

  // Do not touch the following lines
  // This loads all plugins defined in plugins
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
    maxDepth: 1,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;
export { app };
