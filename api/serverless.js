import { app } from '../src/server';

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
