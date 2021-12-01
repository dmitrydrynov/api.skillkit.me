import fp from 'fastify-plugin';
import graphql from './graphql';
import sequelize from './sequelize';

export default fp(async (fastify) => {
  fastify.register(sequelize);
  fastify.register(graphql);
});
