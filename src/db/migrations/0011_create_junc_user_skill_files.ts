import { INTEGER, QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.createTable('_user_skill_files', {
    user_skill_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: {
        model: 'user_skills',
        key: 'id',
      },
    },
    user_file_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: {
        model: 'user_files',
        key: 'id',
      },
    },
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.dropTable('_user_skill_files');
}
