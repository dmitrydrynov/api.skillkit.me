import { UserKitViewModeEnum } from '@entities/user-kit/user-kit.types';
import { BOOLEAN, DATE, ENUM, INTEGER, QueryInterface, STRING, TEXT, fn } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.createTable('user_kits', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    profession_id: {
      type: INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      references: {
        model: 'professions',
        key: 'id',
      },
    },
    is_draft: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    view_mode: {
      type: ENUM,
      values: Object.values(UserKitViewModeEnum),
      allowNull: false,
      defaultValue: UserKitViewModeEnum.ONLY_ME,
    },
    description: TEXT,
    share_link: STRING,
    published_at: DATE,
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

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.dropTable('user_kits');
}
