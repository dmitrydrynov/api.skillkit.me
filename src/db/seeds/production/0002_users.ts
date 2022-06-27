import Role from '@entities/role/role.model';
import User from '@entities/user/user.model';
import { encryptPassword } from '@helpers/encrypt';
import { Op, QueryInterface, Sequelize } from 'sequelize';
import { MigrationParams } from 'umzug';
import usersData from './data/users.json';

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  const roles: Role[] = await Role.findAll();
  const firstUser = await User.findByPk(1);

  if (firstUser) {
    return;
  }

  const data = usersData.map((user) => ({
    ...user,
    role_id: roles.find((r) => r.name.toString() === user.role_id).id,
    password: encryptPassword(sequelize.sequelize, user.password),
  }));

  await User.bulkCreate(data, { ignoreDuplicates: true });
  await sequelize.sequelize.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${data.length + 1}`);
}

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkDelete('users', Sequelize.where(Sequelize.col('email'), { [Op.like]: '%example.com' }));
  await sequelize.bulkDelete('users', Sequelize.where(Sequelize.col('id'), { [Op.in]: usersData.map((u) => u.id) }));
}
