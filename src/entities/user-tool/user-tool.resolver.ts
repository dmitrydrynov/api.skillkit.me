import CurrentUser from '@entities/auth/current-user.decorator';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import UserTool from './user-tool.model';
import { UserToolCreateInput, UserToolOrderByInput, UserToolUpdateInput, UserToolWhereInput } from './user-tool.types';

@Resolver()
export class UserToolResolver {
  /**
   * User tools list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserTool], { description: 'Get user tools list' })
  async userTools(
    @Arg('where', { nullable: true }) where: UserToolWhereInput,
    @Arg('orderBy', () => [UserToolOrderByInput], { nullable: true }) orderBy: UserToolOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
    @CurrentUser() authUser: User,
  ): Promise<Array<UserTool>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const userTools: UserTool[] = await UserTool.findAll({
        ...findOptions,
        where: {
          ...findOptions.where,
          userId: authUser.id,
        },
      });

      return userTools;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user tool
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserTool, { description: 'Get tools list' })
  async userTool(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<UserTool> {
    try {
      const userTool: UserTool = await UserTool.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return userTool;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user tool
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserTool, { description: 'Add a user tool' })
  async createUserTool(@Arg('data') data: UserToolCreateInput, @CurrentUser() authUser: User): Promise<UserTool> {
    try {
      const { title, description } = data;

      const [userTool, created] = await UserTool.findOrCreate({
        where: {
          userId: authUser.id,
          title,
        },
        defaults: {
          userId: authUser.id,
          title,
          description,
        },
      });

      if (!created) {
        throw Error('You have this tool already. Select it from tools list.');
      }

      return userTool;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Update a user tool
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserTool, { description: 'Add a user tool' })
  async updateUserTool(
    @Arg('where') where: WhereUniqueInput,
    @Arg('data') data: UserToolUpdateInput,
    @CurrentUser() authUser: User,
  ): Promise<UserTool> {
    try {
      const userTool: UserTool = await UserTool.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return await userTool.update(data);
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Delete user tool
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number, { description: 'Delete user tool' })
  async deleteUserTool(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<number> {
    try {
      return await UserTool.destroy({ where: { id: where.id, userId: authUser.id } });
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }
}
