import { env } from '@config/env';
import closeWithGrace from 'close-with-grace';
import Fastify, { FastifyInstance } from 'fastify';

export const app: FastifyInstance = Fastify({
  ignoreTrailingSlash: true,
  trustProxy: true,
  logger: {
    level: env.LOG_LEVEL,
    transport: env.LOG_PRETTY_PRINT
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true,
          },
        }
      : undefined,
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
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info('Fastify v' + app.version + ' started');
  } catch (err: any) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
