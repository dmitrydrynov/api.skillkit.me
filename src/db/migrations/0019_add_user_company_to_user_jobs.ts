import UserCompany from '@entities/user-company/user-company.model';
import UserJob from '@entities/user-job/user-job.model';
import { INTEGER, QueryInterface, STRING } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_jobs');

  if (!tableDefinition.user_company_id) {
    await queryInterface.addColumn('user_jobs', 'user_company_id', {
      type: INTEGER,
      allowNull: true,
      onDelete: 'cascade',
      references: {
        model: 'user_companies',
        key: 'id',
      },
    });
  }

  await queryInterface.changeColumn('user_jobs', 'title', {
    type: STRING,
    allowNull: true,
    comment: 'Deprecated column. Will be deleted in the future.',
  });

  /** Update user jobs items */
  const userJobs = await UserJob.findAll();

  if (userJobs) {
    await Promise.all(
      userJobs.map(async (userJob) => {
        const [uc] = await UserCompany.findOrCreate({
          where: { name: userJob.title },
          defaults: {
            userId: userJob.userId,
            name: userJob.title,
          },
        });

        await userJob.update({ userCompanyId: uc.id });
        await userJob.update({ title: null });
      }),
    );
  }

  await queryInterface.changeColumn('user_jobs', 'user_company_id', {
    type: INTEGER,
    allowNull: false,
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_jobs');

  if (!tableDefinition.title) {
    await queryInterface.addColumn('user_jobs', 'title', {
      type: STRING,
      allowNull: true,
    });
  }

  /** Update user jobs items */
  const userJobs = await UserJob.findAll();

  if (userJobs) {
    await Promise.all(
      userJobs.map(async (userJob) => {
        const uc: UserCompany = await userJob.getUserCompanyItem();
        await userJob.update({ title: uc.name });
        await uc.destroy();
      }),
    );
  }

  if (tableDefinition.user_company_id) {
    await queryInterface.removeColumn('user_jobs', 'user_company_id');
  }
}
