import { join } from 'path';
import { env } from '@config/env';
import { FastifyPluginAsync } from 'fastify';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import Cors from 'fastify-cors';
import { fileRoutes } from 'fastify-file-routes';
import { default as fastifyJWT } from 'fastify-jwt';
import oauth2 from 'fastify-oauth2';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // CORS
  fastify.register(Cors, {
    credentials: true,
    origin: true,
  });

  // Register JWT
  fastify.register(fastifyJWT, {
    secret: env.JWT_SECRET,
    verify: { maxAge: env.TOKEN_TTL },
  });

  // DISCORD OAUTH2
  fastify.register(oauth2, {
    name: 'discordOAuth2',
    credentials: {
      client: {
        id: env.DISCORD_CLIENT_ID,
        secret: env.DISCORD_SECRET,
      },
      auth: oauth2.DISCORD_CONFIGURATION,
    },
    scope: ['identify', 'email'],
    startRedirectPath: '/auth/discord',
    callbackUri: env.DISCORD_REDIRECT_URI, // this URL must be exposed
  });

  // Do not touch the following lines
  // This loads all plugins defined in plugins
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
    maxDepth: 1,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(fileRoutes, {
    routesDir: './routes',
  });
};

export default app;
export { app };

declare module 'fastify' {
  interface FastifyInstance {
    discordOAuth2: any;
  }
}
