import { AllowNull, AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType('WorkPlace')
@Table({ underscored: true })
export default class WorkPlace extends Model {
  @Field()
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Field()
  @AllowNull(false)
  @Column
  name: string;

  @Field()
  @Column
  country?: string;

  @Field()
  @Column
  city?: string;

  @Field()
  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt: Date;

  @Field()
  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt: Date;
}
