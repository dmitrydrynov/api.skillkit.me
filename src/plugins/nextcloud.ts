/* eslint-disable import/no-named-as-default */
import { env } from '@config/env';
import fp from 'fastify-plugin';
import NextcloudClient from 'nextcloud-link';

export default fp(
  async (fastify) => {
    const nextcloudClient = new NextcloudClient({
      url: env.NEXTCLOUD_URL,
      password: env.NEXTCLOUD_PASSWORD,
      username: env.NEXTCLOUD_USERNAME,
    });

    fastify.decorate('nextcloud', nextcloudClient);
  },
  { name: 'nextcloudPlugin' },
);

declare module 'fastify' {
  interface FastifyInstance {
    nextcloud: NextcloudClient;
  }
}
