/* eslint-disable @typescript-eslint/ban-ts-comment */
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
// @ts-ignore
app.register(import('../src/server'));

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
