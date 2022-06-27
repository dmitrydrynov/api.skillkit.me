import { IDFilter, OrderDirection } from '@plugins/graphql/types/common.types';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, ID, InputType, registerEnumType } from 'type-graphql';
import { UserFileType } from './user-file.model';

registerEnumType(UserFileType, {
  name: 'UserFileType',
});

@InputType('UserFileWhereInput')
export class UserFileWhereInput {
  @Field(() => IDFilter, { nullable: true })
  id?: IDFilter;
}

@InputType('UserFileOrderByInput')
export class UserFileOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  title?: OrderDirection;
}

@InputType('UserFileUpdateInput')
export class UserFileUpdateInput {
  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  file?: FileUpload;
}

@InputType('UserFileCreateInput')
export class UserFileCreateInput {
  @Field()
  title: string;

  @Field(() => GraphQLUpload, { nullable: true })
  file?: FileUpload;

  @Field({ nullable: true })
  url?: string;

  @Field()
  attachTo: string;

  @Field(() => ID)
  attachId: number;

  @Field(() => UserFileType)
  type: UserFileType;

  @Field({ nullable: true })
  description?: string;
}
