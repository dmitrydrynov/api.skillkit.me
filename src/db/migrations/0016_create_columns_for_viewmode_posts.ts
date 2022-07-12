import { PostViewModeEnum } from '@entities/post/post.types';
import { ENUM, QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.addColumn('posts', 'view_mode', {
    type: ENUM,
    values: Object.values(PostViewModeEnum),
    allowNull: false,
    defaultValue: PostViewModeEnum.ONLY_ME,
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.removeColumn('posts', 'view_mode');
  await queryInterface.sequelize.query(`DROP TYPE enum_posts_view_mode`);
}
