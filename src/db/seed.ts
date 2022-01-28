import 'dotenv/config';
import { resolve as pathResolve } from 'path';
import { env } from '@config/env';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';

(async () => {
  const sequelize = new Sequelize(
    `postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
    {
      models: [pathResolve(__dirname, '../entities/**/*.model.ts')],
    },
  );

  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(`Cannot connect to database: ${error.message}`);
    process.exit(1);
  }

  const storage = new SequelizeStorage({ sequelize, modelName: 'sequelize_seeding_meta' });

  const umzug = new Umzug({
    storage,
    context: sequelize.getQueryInterface(),
    logger: console,
    migrations: { glob: [`seeds/${env.NODE_ENV}/*.{js,ts}`, { cwd: __dirname }] },
  });

  await umzug.runAsCLI();
  process.exit();
})();
