import { DATE, INTEGER, QueryInterface, STRING, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('connected_users', {
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
    service_name: {
      type: STRING,
      allowNull: false,
    },
    service_user_id: {
      type: STRING,
      allowNull: false,
    },
    username: {
      type: STRING,
    },
    avatar: {
      type: STRING,
    },
    token: {
      type: STRING,
      allowNull: false,
    },
    expires_in: {
      type: INTEGER,
      allowNull: false,
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
  await sequelize.dropTable('connected_users');
}
