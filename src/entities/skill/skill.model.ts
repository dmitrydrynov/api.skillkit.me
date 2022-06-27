import { AllowNull, AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType('Skill')
@Table({ underscored: true })
export default class Skill extends Model {
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
