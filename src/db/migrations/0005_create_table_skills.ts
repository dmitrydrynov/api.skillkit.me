import { DATE, INTEGER, QueryInterface, STRING, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.createTable('skills', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: STRING,
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
  await sequelize.dropTable('skills');
}
