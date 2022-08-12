import { app } from '../src/server';

export default async (req, res) => {
  await app.ready();

  return app.server.emit('request', req, res);
};
