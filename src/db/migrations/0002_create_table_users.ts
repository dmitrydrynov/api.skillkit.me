import { BOOLEAN, DATE, INTEGER, QueryInterface, STRING, TEXT, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.createTable('users', {
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
    birthday_date: DATE,
    blocked: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    about: TEXT,
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

  await queryInterface.sequelize.query(
    `ALTER TABLE users ADD COLUMN full_name text GENERATED ALWAYS AS (
      trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
    ) STORED;`,
  );
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.dropTable('users');
}
