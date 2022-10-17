import UserJob from '@entities/user-job/user-job.model';
import WorkPlace from '@entities/work-place/work-place.model';
import { INTEGER, QueryInterface, STRING } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_jobs');

  if (!tableDefinition.work_place_id) {
    await queryInterface.addColumn('user_jobs', 'work_place_id', {
      type: INTEGER,
      allowNull: true,
      onDelete: 'cascade',
      references: {
        model: 'work_places',
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
        const [wp] = await WorkPlace.findOrCreate({
          where: { name: userJob.title },
          defaults: {
            name: userJob.title,
          },
        });

        await userJob.update({ workPlaceId: wp.id });
        await userJob.update({ title: null });
      }),
    );
  }

  await queryInterface.changeColumn('user_jobs', 'work_place_id', {
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
        const wp: WorkPlace = await userJob.getWorkPlaceItem();
        await userJob.update({ title: wp.name });
        await wp.destroy();
      }),
    );
  }

  if (tableDefinition.work_place_id) {
    await queryInterface.removeColumn('user_jobs', 'work_place_id');
  }
}
