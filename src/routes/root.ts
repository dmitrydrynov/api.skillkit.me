import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (req, reply) {
    reply.type('text/html; charset=utf-8');

    return reply.send('Gamelab API v0.0.1-alpha');
  });
};

export default root;
