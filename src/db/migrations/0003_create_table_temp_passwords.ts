import { DATE, INTEGER, QueryInterface, STRING, fn, literal } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.createTable('temp_passwords', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: INTEGER,
      unique: true,
      onDelete: 'cascade',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    temp_password: {
      type: STRING,
      allowNull: false,
    },
    expires_on: {
      type: DATE,
      allowNull: false,
      defaultValue: literal("NOW() + INTERVAL '24 HOUR'"),
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
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.dropTable('temp_passwords');
}
