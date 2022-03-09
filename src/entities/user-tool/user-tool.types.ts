import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { Field, InputType } from 'type-graphql';

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
  title?: OrderDirection;
}

@InputType('UserToolUpdateInput')
export class UserToolUpdateInput {
  @Field()
  description: string;
}

@InputType('UserToolCreateInput')
export class UserToolCreateInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description?: string;
}
