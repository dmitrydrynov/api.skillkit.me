import { env } from '@config/env';
import closeWithGrace from 'close-with-grace';
import Fastify, { FastifyInstance } from 'fastify';

export const app: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  trustProxy: true,
  logger: {
    level: env.LOG_LEVEL,
    prettyPrint: env.LOG_PRETTY_PRINT,
  },
});

// Register your application as a normal plugin.
app.register(import('../src/app'), { prefix: '/' });

const closeListeners = closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err) {
    console.error(err);
  }
  await app.close();
});

app.addHook('onClose', async (instance, done) => {
  closeListeners.uninstall();
  done();
});

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
