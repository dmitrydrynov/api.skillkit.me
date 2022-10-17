import School from '@entities/school/school.model';
import UserSchool from '@entities/user-school/user-school.model';
import { INTEGER, QueryInterface, STRING } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_schools');

  if (!tableDefinition.school_id) {
    await queryInterface.addColumn('user_schools', 'school_id', {
      type: INTEGER,
      allowNull: true,
      onDelete: 'cascade',
      references: {
        model: 'schools',
        key: 'id',
      },
    });
  }

  await queryInterface.changeColumn('user_schools', 'title', {
    type: STRING,
    allowNull: true,
    comment: 'Deprecated column. Will be deleted in the future.',
  });

  /** Update user schools items */
  const userSchools = await UserSchool.findAll();

  if (userSchools) {
    await Promise.all(
      userSchools.map(async (userSchool) => {
        const [school] = await School.findOrCreate({
          where: { name: userSchool.title },
          defaults: {
            name: userSchool.title,
          },
        });

        await userSchool.update({ schoolId: school.id });
        await userSchool.update({ title: null });
      }),
    );
  }

  await queryInterface.changeColumn('user_schools', 'school_id', {
    type: INTEGER,
    allowNull: false,
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_schools');

  if (!tableDefinition.title) {
    await queryInterface.addColumn('user_schools', 'title', {
      type: STRING,
      allowNull: true,
    });
  }

  /** Update user jobs items */
  const userSchools = await UserSchool.findAll();

  if (userSchools) {
    await Promise.all(
      userSchools.map(async (userSchool) => {
        const school: School = await userSchool.getSchoolItem();
        await userSchool.update({ title: school.name });
        await school.destroy();
      }),
    );
  }

  if (tableDefinition.school_id) {
    await queryInterface.removeColumn('user_schools', 'school_id');
  }
}
