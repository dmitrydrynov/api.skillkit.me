import { UserFileType } from '@entities/user-file/user-file.model';
import { DATE, ENUM, INTEGER, QueryInterface, STRING, TEXT, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('user_files', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    url: {
      type: STRING,
      allowNull: false,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    description: TEXT,
    type: {
      type: ENUM,
      values: Object.values(UserFileType),
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
  await sequelize.dropTable('user_files');
}
