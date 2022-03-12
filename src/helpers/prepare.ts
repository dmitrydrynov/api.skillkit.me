import { SkillOrderByInput, SkillWhereInput } from '@entities/skill/skill.types';
import { OrderDirection, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Op } from 'sequelize';
import { UserToolWhereInput } from './../entities/user-tool/user-tool.types';

export const prepareFindOptions = (
  where: WhereUniqueInput | SkillWhereInput | UserToolWhereInput,
  take = 0,
  skip = 0,
  orderBy: SkillOrderByInput[] = [{ id: OrderDirection.asc }],
) => {
  const findOptions: any = {};

  // prepare Where for Sequelize
  if (where) {
    const sequelizeWhere = {};

    Object.entries(where).map(([key, value]) => {
      let insensitive = false;

      if ('mode' in value) {
        insensitive = value.mode === 1;
        delete value['mode'];
      }

      Object.entries(value).map(([k, v]) => {
        switch (k) {
          case 'equals':
            sequelizeWhere[key] = v;
            break;
          case 'in':
            sequelizeWhere[key] = { [Op.in]: v };
            break;
          case 'contains':
            sequelizeWhere[key] = insensitive ? { [Op.iLike]: `%${v}%` } : { [Op.like]: `%${v}%` };
            break;
          default:
            sequelizeWhere[key][k] = v;
        }
      });
    });

    findOptions.where = sequelizeWhere;
  }

  // prepare Take for Sequelize
  if (take) {
    findOptions.limit = take;
  }

  // prepare Skip for Sequelize
  if (skip) {
    findOptions.offset = skip;
  }

  // prepare Order for Sequelize
  findOptions.order = [];
  orderBy.map((order) => {
    findOptions.order.push([Object.keys(order)[0], Object.values(order)[0]]);
  });

  return findOptions;
};
