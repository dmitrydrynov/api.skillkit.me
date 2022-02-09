import { UserSkillLevelEnum } from '@entities/user-skill/user-skill.types';
import { BOOLEAN, DATE, ENUM, INTEGER, QueryInterface, TEXT, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('user_skills', {
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
    skill_id: {
      type: INTEGER,
      allowNull: false,
      unique: true,
      onDelete: 'cascade',
      references: {
        model: 'skills',
        key: 'id',
      },
    },
    level: {
      type: ENUM,
      values: Object.values(UserSkillLevelEnum),
      allowNull: false,
    },
    initial_id: {
      type: INTEGER,
      allowNull: true,
      onDelete: 'cascade',
      references: {
        model: 'user_skills',
        key: 'id',
      },
    },
    is_draft: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: TEXT,
    published_at: DATE,
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
  await sequelize.dropTable('user_skills');
}
