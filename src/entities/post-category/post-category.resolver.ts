import Post from '@entities/post/post.model';
import { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import PostCategory from './post-category.model';
import { PostCategoryOrderByInput, PostCategoryWhereInput } from './post-category.types';

@Resolver()
export class PostCategoryResolver {
  /**
   * PostCategories list
   */
  @Query(() => [PostCategory])
  async postCategories(
    @Arg('where', { nullable: true }) where: PostCategoryWhereInput,
    @Arg('orderBy', () => [PostCategoryOrderByInput], { nullable: true }) orderBy: PostCategoryOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<PostCategory>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const postCategories: PostCategory[] = await PostCategory.findAll({ ...findOptions, include: [Post] });

      return postCategories;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Read a post category
   */
  @Query(() => PostCategory, { nullable: true })
  async postCategory(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<PostCategory> {
    try {
      const postCategory = await PostCategory.findByPk(where.id, { include: [Post] });

      return postCategory;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a postCategory
   */
  @Authorized([UserRole.ADMIN])
  @Mutation(() => PostCategory)
  async createPostCategory(@Arg('name') name: string): Promise<PostCategory> {
    try {
      const postCategory: PostCategory = await PostCategory.create({
        name,
      });

      return postCategory;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
