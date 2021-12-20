import { QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: { sequelize } }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
}

export async function down({ context: { sequelize } }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.query('DROP EXTENSION IF EXISTS "pgcrypto";');
}
