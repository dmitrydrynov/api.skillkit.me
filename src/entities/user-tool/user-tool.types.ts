import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, ID, InputType } from 'type-graphql';

@InputType('UserToolWhereInput')
export class UserToolWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;

  @Field(() => IDFilter, { nullable: true })
  userSkillId?: IDFilter;
}

@InputType('UserToolOrderByInput')
export class UserToolOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  title?: OrderDirection;
}

@InputType('UserToolUpdateInput')
export class UserToolUpdateInput {
  @Field({ nullable: true })
  description: string;
}

@InputType('UserToolCreateInput')
export class UserToolCreateInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  userSkillId: number;
}
