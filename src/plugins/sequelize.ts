import { resolve as pathResolve } from 'path';
import { env } from '@config/env';
import fp from 'fastify-plugin';
import { Client } from 'pg';
import AddHierarchyForSequelize from 'sequelize-hierarchy-ts';
import { Sequelize } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript/dist/model/model/model';
import { ModelAttributeColumnOptions } from 'sequelize/types';

AddHierarchyForSequelize(Sequelize);

export default fp(
  async (fastify) => {
    // create db if it doesn't already exist
    const client = new Client(env.DB_URL);
    await client.connect();

    try {
      await client.query(`CREATE DATABASE ${env.DB_NAME};`);
      fastify.log.info(`A table "${env.DB_NAME}" created.`);
    } catch (error) {
      fastify.log.info(`A table "${env.DB_NAME}" already exists.`);
    }

    const _sequelize = new Sequelize(`${env.DB_URL}/${env.DB_NAME}`, {
      logging(message) {
        fastify.log.debug(message);
      },
      models: [pathResolve(__dirname, '../entities/**/*.model.{js,ts}')],
    });

    try {
      await _sequelize.authenticate();

      fastify.log.info('Connected to database');
    } catch (error) {
      fastify.log.fatal(`Cannot connect to database: ${error.message}`);
      process.exit(1);
    }

    fastify.decorate('sequelize', _sequelize);
  },
  { name: 'sequelize' },
);

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize;
  }
}

declare module 'sequelize-typescript' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  export function Column(options: Partial<ModelAttributeColumnOptions & { hierarchy: boolean }>): Function;
}
