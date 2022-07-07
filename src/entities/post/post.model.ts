import PostCategory from '@entities/post-category/post-category.model';
import User from '@entities/user/user.model';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import { PostAuthorField } from './post.types';

@ObjectType('Post')
@Table({ underscored: true })
export default class Post extends Model {
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
  title: string;

  @Field()
  @AllowNull(false)
  @Column
  content: string;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @BelongsTo(() => User)
  authorItem: User;

  @Field(() => PostAuthorField)
  async author() {
    const _author = await this.getAuthorItem();

    return {
      id: _author.id,
      fullName: _author.fullName,
      age: _author.age(),
      avatar: _author.avatar,
      email: _author.email,
    };
  }

  @Field()
  @AllowNull(false)
  @Column
  isDraft: boolean;

  @ForeignKey(() => PostCategory)
  @Column
  categoryId: number;

  @Field(() => PostCategory)
  @BelongsTo(() => PostCategory)
  category: PostCategory;

  // @HasOne(() => PostCategory, { foreignKey: 'id' })
  // categoryItem: PostCategory;

  // @Field(() => PostCategory)
  // async category() {
  //   return this.getCategoryItem();
  // }

  @Field({ nullable: true })
  @Column
  publishedAt?: Date;

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
