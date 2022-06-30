import { INTEGER, QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableColumns = await queryInterface.describeTable('user_skills');

  if (tableColumns.initial_id) {
    await queryInterface.removeColumn('user_skills', 'initial_id');
    await queryInterface.addColumn('user_skills', 'parent_id', {
      type: INTEGER,
      allowNull: true,
      onDelete: 'SET NULL',
      references: {
        model: 'user_skills',
        key: 'id',
      },
    });
    await queryInterface.addColumn('user_skills', 'hierarchy_level ', INTEGER);
  }
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableColumns = await queryInterface.describeTable('user_skills');

  if (tableColumns.parent_id) {
    await queryInterface.removeColumn('user_skills', 'parent_id');
    await queryInterface.addColumn('user_skills', 'initial_id', {
      type: INTEGER,
      allowNull: true,
      onDelete: 'cascade',
      references: {
        model: 'user_skills',
        key: 'id',
      },
    });
  }

  if (tableColumns.hierarchy_level) {
    await queryInterface.removeColumn('user_skills', 'hierarchy_level');
  }
}
