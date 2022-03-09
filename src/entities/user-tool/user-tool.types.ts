import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum UserToolLevelEnum {
  INTERFACE = 'interface', // LVL1 - ориентация в интерфейсе
  BASIC = 'basic', // LVL2 - может выполнить базовые функции инструмента
  MASTER = 'master', // LVL3 - уверенно владеет функционалом требуемой для решаемой задачи и умело его настраивает
  ADVANCED = 'ADVANCED', // LVL4 - владеет всем функционалом инструмента и его настройками
  EXPERT = 'expert', // LVL5 - умеет создавать дополнительный функционал для этого инструмента
}

registerEnumType(UserToolLevelEnum, {
  name: 'UserToolLevelEnum',
});

@InputType('UserToolWhereInput')
export class UserToolWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;
}

@InputType('UserToolOrderByInput')
export class UserToolOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  level?: OrderDirection;
}

@InputType('UserToolUpdateInput')
export class UserToolUpdateInput {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isDraft?: boolean;

  @Field(() => UserToolLevelEnum, { nullable: true })
  level?: UserToolLevelEnum;

  @Field({ nullable: true })
  skillId?: number;
}
