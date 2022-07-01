import { INTEGER, QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableColumns = await queryInterface.describeTable('user_skills');

  if (tableColumns.initial_id) {
    await queryInterface.removeColumn('user_skills', 'initial_id');
  }
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
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
