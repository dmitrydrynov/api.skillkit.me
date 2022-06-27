/* eslint-disable import/no-named-as-default */
import { env } from '@config/env';
import client, { SanityClient } from '@sanity/client';
import fp from 'fastify-plugin';

export default fp(
  async (fastify) => {
    const sanityClient = new client({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
      token: env.SANITY_TOKEN, // or leave blank for unauthenticated usage
      useCdn: true,
    });

    fastify.decorate('sanity', sanityClient);
  },
  { name: 'sanityPlugin' },
);

declare module 'fastify' {
  interface FastifyInstance {
    sanity: SanityClient;
  }
}
