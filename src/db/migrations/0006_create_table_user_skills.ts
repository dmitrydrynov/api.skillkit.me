import { UserSkillLevelEnum } from '@entities/user-skill/user-skill.types';
import { BOOLEAN, DATE, ENUM, INTEGER, QueryInterface, STRING, TEXT, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.createTable('user_skills', {
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
    share_link: STRING,
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

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.dropTable('user_skills');
  await queryInterface.sequelize.query(`DROP TYPE enum_user_skills_level`);
}
