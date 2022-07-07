import { Op, QueryInterface, Sequelize } from 'sequelize';
import { MigrationParams } from 'umzug';
import postCategoriesData from './data/post-categories.json';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkInsert('post-categories', postCategoriesData);
}

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkDelete(
    'post-categories',
    Sequelize.where(Sequelize.col('id'), { [Op.in]: postCategoriesData.map((r) => r.id) }),
  );
}
