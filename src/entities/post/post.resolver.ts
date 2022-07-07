import CurrentUser from '@entities/auth/current-user.decorator';
import PostCategory from '@entities/post-category/post-category.model';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import Post from './post.model';
import { PostCreateInput, PostOrderByInput, PostWhereInput } from './post.types';

@Resolver()
export class PostResolver {
  /**
   * Posts list
   */
  @Query(() => [Post])
  async posts(
    @Arg('where', { nullable: true }) where: PostWhereInput,
    @Arg('orderBy', () => [PostOrderByInput], { nullable: true }) orderBy: PostOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<Post>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const posts: Post[] = await Post.findAll({ ...findOptions, include: [PostCategory] });

      return posts;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Read a post
   */
  @Query(() => Post, { nullable: true })
  async post(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<Post> {
    try {
      const post = await Post.findByPk(where.id, { include: [User, PostCategory] });

      return post;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a post
   */
  @Authorized([UserRole.ADMIN])
  @Mutation(() => Post)
  async createPost(
    @Arg('data', () => PostCreateInput) data: PostCreateInput,
    @CurrentUser() authUser: User,
  ): Promise<Post> {
    try {
      if (!data) {
        throw Error('No data for creating the post');
      }

      const post: Post = await Post.create(
        {
          ...data,
          isDraft: true,
          categoryId: data.categoryId || 1,
          authorId: data.authorId || authUser.id,
        },
        { include: [PostCategory, User] },
      );

      return post;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
