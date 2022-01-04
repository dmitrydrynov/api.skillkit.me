import { Route } from 'fastify-file-routes';

export const routes: Route = {
  get: {
    handler: async (_request, reply) => {
      reply.type('text/html; charset=utf-8');
      await reply.send('Gamelab API v0.0.1-alpha');
    },
  },
};
