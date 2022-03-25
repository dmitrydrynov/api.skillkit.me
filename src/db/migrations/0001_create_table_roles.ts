import { UserRole } from '@entities/user/user.model';
import { ENUM, INTEGER, QueryInterface } from 'sequelize';
import { MigrationParams } from 'umzug';

export async function up({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.createTable('roles', {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: ENUM,
      values: Object.values(UserRole),
      allowNull: false,
    },
  });
}

export async function down({ context: queryInterface }: MigrationParams<QueryInterface>): Promise<void> {
  await queryInterface.dropTable('roles');
  await queryInterface.sequelize.query(`DROP TYPE enum_roles_name`);
}
