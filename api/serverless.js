// Require the framework
import Fastify from 'fastify';
// Read the .env file.
import * as typedDotenv from 'typed-dotenv';

typedDotenv.config({ debug: false });

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(import('../src/server.ts'));

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
