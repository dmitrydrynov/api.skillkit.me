import { UserSkillViewModeEnum } from '@entities/user-skill/user-skill.types';
import { ENUM, QueryInterface, STRING } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.addColumn('user_skills', 'view_mode', {
    type: ENUM,
    values: Object.values(UserSkillViewModeEnum),
    allowNull: false,
    defaultValue: UserSkillViewModeEnum.ONLY_ME,
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.removeColumn('user_skills', 'view_mode');
  await queryInterface.sequelize.query(`DROP TYPE enum_user_skills_view_mode`);
}
