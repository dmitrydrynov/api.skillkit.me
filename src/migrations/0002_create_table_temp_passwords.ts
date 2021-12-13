import { DATE, INTEGER, QueryInterface, STRING, fn, literal } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('temp_passwords', {
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

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.dropTable('temp_passwords');
}
