import { resolve as pathResolve } from 'path';
import { env } from '@config/env';
import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize-typescript';

export default fp(
  async (fastify) => {
    const sequelize = new Sequelize(
      `postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
      {
        logging(message) {
          fastify.log.debug(message);
        },
        models: [pathResolve(__dirname, '../entities/**/*.model.ts')],
      },
    );

    try {
      await sequelize.authenticate();

      fastify.log.info('Connected to database');
    } catch (error) {
      fastify.log.fatal(`Cannot connect to database: ${error.message}`);
      process.exit(1);
    }

    fastify.decorate('sequelize', sequelize);
  },
  { name: 'sequelize' },
);

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize;
  }
}
