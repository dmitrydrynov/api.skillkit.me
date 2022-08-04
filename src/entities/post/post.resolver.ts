import { env } from '@config/env';
import CurrentUser from '@entities/auth/current-user.decorator';
import PostCategory from '@entities/post-category/post-category.model';
import User, { UserRole } from '@entities/user/user.model';
import { removeFile, uploadFile } from '@helpers/file';
import { prepareFindOptions } from '@helpers/prepare';
import { slugify } from '@helpers/text';
import { DefaultResponseType } from '@plugins/graphql/types/common.types';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import Hashids from 'hashids';
import { DateTime } from 'luxon';
import { MercuriusContext } from 'mercurius';
import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import Post from './post.model';
import {
  PostCreateInput,
  PostOrderByInput,
  PostUpdateInput,
  PostViewModeEnum,
  PostWhereInput,
  PostWhereUniqueInput,
  UploadPostImageResponse,
} from './post.types';

const hashids = new Hashids(env.HASH_SALT, 16);

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
  async post(@Arg('where', { nullable: true }) where: PostWhereInput): Promise<Post> {
    try {
      const findOptions: any = prepareFindOptions(where);
      const post = await Post.findOne({ ...findOptions, include: [User, PostCategory] });

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
          slug: data.slug ? data.slug : slugify(data.title),
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

  /**
   * Update a post
   */
  @Authorized([UserRole.ADMIN])
  @Mutation(() => Post)
  async updatePost(
    @Arg('where') where: PostWhereUniqueInput,
    @Arg('data', () => PostUpdateInput) data: PostUpdateInput,
  ): Promise<Post> {
    try {
      if (!data || !where.id) {
        throw Error('No data for creating the post');
      }

      const post = await Post.findByPk(where.id);
      await post.update({
        ...data,
        viewMode: data.viewMode ? data.viewMode.toLowerCase() : post.viewMode,
        slug: data.slug ? data.slug : slugify(post.title),
      });

      return post;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Publish post
   */
  @Authorized([UserRole.ADMIN])
  @Mutation(() => Post)
  async publishPost(@Arg('id', () => ID) recordId: number): Promise<Post> {
    try {
      const publishedAt = DateTime.now();

      const [effectedCount, userSkills] = await Post.update(
        {
          isDraft: false,
          publishedAt: publishedAt.toISO(),
          viewMode: PostViewModeEnum.EVERYONE,
        },
        { where: { id: recordId }, returning: true },
      );

      return effectedCount > 0 ? userSkills[0] : null;
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Upload image
   */
  @Authorized([UserRole.ADMIN])
  @Mutation(() => UploadPostImageResponse)
  async uploadImage(
    @Arg('image', () => GraphQLUpload) image: FileUpload,
    @CurrentUser() authUser: User,
    @Ctx() ctx: MercuriusContext,
  ): Promise<UploadPostImageResponse> {
    try {
      const fileName = 'post-image-' + hashids.encode(authUser.id, Date.now());
      const { url, width, height } = await uploadFile(ctx.app, image, 'files', fileName);

      return { url, width, height };
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Remove image
   */
  @Authorized([UserRole.ADMIN])
  @Mutation(() => DefaultResponseType)
  async removeImage(@Arg('imageUrl') imageUrl: string, @Ctx() ctx: MercuriusContext): Promise<DefaultResponseType> {
    try {
      await removeFile(ctx.app, imageUrl);

      return { result: true };
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }
}
