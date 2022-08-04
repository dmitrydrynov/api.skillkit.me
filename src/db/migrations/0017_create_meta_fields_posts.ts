import { QueryInterface, STRING, TEXT } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.addColumn('posts', 'description', {
    type: TEXT,
    allowNull: true,
  });
  await queryInterface.addColumn('posts', 'feature_image', {
    type: STRING,
    allowNull: true,
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.removeColumn('posts', 'description');
  await queryInterface.removeColumn('posts', 'feature_image');
}
