import Role from '@entities/role/role.model';
import User from '@entities/user/user.model';
import { encryptPassword } from '@helpers/encrypt';
import { faker } from '@faker-js/faker';
import { Op, QueryInterface, Sequelize } from 'sequelize';
import { MigrationParams } from 'umzug';
import usersData from './data/users.json';

const { address, datatype, internet, name, random, image, lorem } = faker;

const USERS_COUNT = 100;

export async function up({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  const roles: Role[] = await Role.findAll();

  const data = usersData.map((user) => ({
    ...user,
    roleId: roles.find((r) => r.name.toString() === user.roleId).id,
    password: encryptPassword(sequelize.sequelize, user.password),
  }));

  const generated = Array(Math.max(data.length, USERS_COUNT - data.length))
    .fill(null)
    .map((_, index) => {
      return {
        id: data.length + index + 1,
        email: internet.email(null, null, 'example.com'),
        password: random.arrayElement([null, encryptPassword(sequelize.sequelize, internet.password(8))]),
        firstName: name.firstName(),
        lastName: name.lastName(),
        country: random.arrayElement([null, address.countryCode()]),
        blocked: datatype.boolean(),
        roleId: random.arrayElement(roles.map((r) => r.id)),
        birthdayDate: datatype.datetime({ max: Date.now() }),
        avatar: image.avatar(),
        about: lorem.paragraphs(),
      };
    });

  const records = data.concat(generated);

  await User.bulkCreate(records, { ignoreDuplicates: true });
  await sequelize.sequelize.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${records.length + 1}`);
}

export async function down({ context: sequelize }: MigrationParams<QueryInterface>): Promise<void> {
  await sequelize.bulkDelete('users', Sequelize.where(Sequelize.col('email'), { [Op.like]: '%example.com' }));
  await sequelize.bulkDelete('users', Sequelize.where(Sequelize.col('id'), { [Op.in]: usersData.map((u) => u.id) }));
}
