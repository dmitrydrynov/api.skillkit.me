import 'dotenv/config';
import { env } from '@config/env';
import ConnectedUser from '@entities/connected-users/connected-user.model';
import Role from '@entities/role/role.model';
import Skill from '@entities/skill/skill.model';
import TempPassword from '@entities/temp-password/temp-password.model';
import UserSkill from '@entities/user-skill/user-skill.model';
import User from '@entities/user/user.model';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';

(async () => {
  const sequelize = new Sequelize(`${env.DB_URL}/${env.DB_NAME}`, {
    models: [Role, User, Skill, UserSkill, TempPassword, ConnectedUser],
  });

  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(`Cannot connect to database: ${error.message}`);
    process.exit(1);
  }

  const storage = new SequelizeStorage({
    sequelize,
    modelName: 'sequelize_migration_meta',
  });

  const umzug = new Umzug({
    storage,
    context: sequelize.getQueryInterface(),
    logger: console,
    migrations: { glob: ['migrations/*.{js,ts}', { cwd: __dirname }] },
  });

  await umzug.runAsCLI();
  process.exit();
})();
