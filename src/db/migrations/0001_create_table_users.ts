import { BOOLEAN, DATE, INTEGER, QueryInterface, STRING, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('users', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: STRING,
    first_name: STRING,
    last_name: STRING,
    avatar: STRING,
    country: STRING,
    blocked: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
    updated_at: {
      type: DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
  });

  await sequelize.sequelize.query(
    `ALTER TABLE users ADD COLUMN full_name text GENERATED ALWAYS AS (
      trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
    ) STORED;`,
  );
}

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.dropTable('users');
}
