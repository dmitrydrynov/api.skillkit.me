import { Op, QueryInterface, Sequelize } from 'sequelize';
import { MigrationParams } from 'umzug';
import usersData from './data/users.json';
import Role from '../../../entities/role/role.model';
import { encryptPassword } from '../../../helpers/encrypt';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  const roles: Role[] = await Role.findAll();

  const data = usersData.map((user) => ({
    ...user,
    role_id: roles.find((r) => r.name.toString() === user.role_id).id,
    password: encryptPassword(sequelize.sequelize, user.password),
  }));

  await sequelize.bulkInsert('users', data);
  await sequelize.sequelize.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${data.length + 1}`);
}

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkDelete('users', Sequelize.where(Sequelize.col('email'), { [Op.like]: '%example.com' }));
  await sequelize.bulkDelete('users', Sequelize.where(Sequelize.col('id'), { [Op.in]: usersData.map((u) => u.id) }));
}
