import { DATE, INTEGER, QueryInterface, STRING, TEXT, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('user_schools', {
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
    user_skill_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: {
        model: 'user_skills',
        key: 'id',
      },
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    description: TEXT,
    started_at: {
      type: DATE,
      allowNull: false,
    },
    finished_at: {
      type: DATE,
      allowNull: true,
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
  await sequelize.dropTable('user_schools');
}
