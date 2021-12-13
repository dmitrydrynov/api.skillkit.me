import '@config/env';
import { env } from '@config/env';
import Fastify, { FastifyInstance } from 'fastify';
import closeWithGrace from 'close-with-grace';

export const app: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  trustProxy: true,
  logger: {
    level: env.LOG_LEVEL,
    prettyPrint: env.LOG_PRETTY_PRINT,
  },
});

// Register your application as a normal plugin.
app.register(import('./app'));

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

const start = async () => {
  try {
    await app.listen(env.PORT, env.HOST);
  } catch (err: any) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
