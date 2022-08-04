import Post from '@entities/post/post.model';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType('PostCategory')
@Table({ underscored: true })
export default class PostCategory extends Model {
  [x: string]: any;

  @Field()
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Field()
  @AllowNull(false)
  @Column({ unique: true })
  slug: string;

  @Field()
  @AllowNull(false)
  @Column
  name: string;

  @Field({ nullable: true })
  @AllowNull(true)
  @Column
  description: string;

  @HasMany(() => Post, { foreignKey: 'category_id' })
  postItems?: Post[];

  @Field(() => [Post], { nullable: true })
  async posts() {
    return await this.getPostItems();
  }

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
