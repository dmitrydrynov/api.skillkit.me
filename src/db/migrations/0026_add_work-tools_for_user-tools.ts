import UserTool from '@entities/user-tool/user-tool.model';
import WorkTool from '@entities/work-tool/work-tool.model';
import { INTEGER, QueryInterface, STRING } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_tools');

  if (!tableDefinition.work_tool_id) {
    await queryInterface.addColumn('user_tools', 'work_tool_id', {
      type: INTEGER,
      allowNull: true,
      onDelete: 'cascade',
      references: {
        model: 'work_tools',
        key: 'id',
      },
    });
  }

  await queryInterface.changeColumn('user_tools', 'title', {
    type: STRING,
    allowNull: true,
    comment: 'Deprecated column. Will be deleted in the future.',
  });

  /** Update user jobs items */
  const userTools = await UserTool.findAll();

  if (userTools) {
    await Promise.all(
      userTools.map(async (userTool) => {
        const [wt] = await WorkTool.findOrCreate({
          where: { name: userTool.title },
          defaults: {
            name: userTool.title,
          },
        });

        await userTool.update({ workToolId: wt.id });
        await userTool.update({ title: null });
      }),
    );
  }

  await queryInterface.changeColumn('user_tools', 'work_tool_id', {
    type: INTEGER,
    allowNull: false,
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  const tableDefinition = await queryInterface.describeTable('user_tools');

  if (!tableDefinition.title) {
    await queryInterface.addColumn('user_tools', 'title', {
      type: STRING,
      allowNull: true,
    });
  }

  /** Update user jobs items */
  const userTools = await UserTool.findAll();

  if (userTools) {
    await Promise.all(
      userTools.map(async (userTool) => {
        const wt: WorkTool = await userTool.getWorkToolItem();
        await userTool.update({ title: wt.name });
        await wt.destroy();
      }),
    );
  }

  if (tableDefinition.work_tool_id) {
    await queryInterface.removeColumn('user_tools', 'work_tool_id');
  }
}
