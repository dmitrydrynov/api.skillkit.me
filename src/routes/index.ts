import { Route } from 'fastify-file-routes';

export const routes: Route = {
  get: {
    handler: async (_request, reply) => {
      reply.type('text/html; charset=utf-8');
      await reply.send(`
        <html>
        <head>
          <title>Skillkit⚡API</title>
          <meta name="robots" content="noindex, nofollow" />
          <link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet">
        </head>
        <body style="font-family: 'Rubik'; display: flex; justify-content: center; align-items: center;margin: 0; position: absolute; width: 100%; height: 100%">
        <div style="font-size: 24px;">Skillkit⚡API</div>
        </body>
        </html>
      `);
    },
  },
};
