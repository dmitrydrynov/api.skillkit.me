import { Op, QueryInterface, Sequelize } from 'sequelize';
import { MigrationParams } from 'umzug';
import rolesData from './data/roles.json';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkInsert('roles', rolesData);
}

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkDelete('roles', Sequelize.where(Sequelize.col('id'), { [Op.in]: rolesData.map((r) => r.id) }));
}
