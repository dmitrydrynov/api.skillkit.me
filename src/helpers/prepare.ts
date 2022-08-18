import { SkillOrderByInput } from '@entities/skill/skill.types';
import { CommonWhere, OrderDirection } from '@plugins/graphql/types/common.types';
import { Op } from 'sequelize';

export const prepareFindOptions = (
  where: CommonWhere,
  take = 0,
  skip = 0,
  orderBy: SkillOrderByInput[] = [{ id: OrderDirection.asc }],
) => {
  const findOptions: any = {};

  // prepare Where for Sequelize
  if (where) {
    const sequelizeWhere = {};

    Object.entries(where).map(([key, value]) => {
      if (key === 'skill' && 'name' in value) {
        sequelizeWhere[`$skillItem.name$`] = prepareForSequilize(value.name);

        return sequelizeWhere;
      }

      if (typeof value === 'boolean') {
        sequelizeWhere[key] = value;

        return sequelizeWhere;
      }

      sequelizeWhere[key] = prepareForSequilize(value);
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

const prepareForSequilize = (value: any, insensitive = false) => {
  let response: any = {};

  if ('mode' in value) {
    insensitive = value.mode === 1;
    delete value['mode'];
  }

  Object.entries(value).map(([k, v]) => {
    switch (k) {
      case 'equals':
        response = v;
        break;
      case 'in':
        response = { [Op.in]: v };
        break;
      case 'not':
        response = { [Op.not]: v };
        break;
      case 'notIn':
        response = { [Op.notIn]: v };
        break;
      case 'contains':
        response = insensitive ? { [Op.iLike]: `%${v}%` } : { [Op.like]: `%${v}%` };
        break;
      default:
        response[k] = v;
    }
  });

  return response;
};
