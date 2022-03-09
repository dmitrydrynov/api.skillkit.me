import CurrentUser from '@entities/auth/current-user.decorator';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Arg, Authorized, ID, Mutation, Query, Resolver } from 'type-graphql';
import UserTool from './user-tool.model';
import { UserToolLevelEnum, UserToolOrderByInput, UserToolUpdateInput, UserToolWhereInput } from './user-tool.types';

@Resolver()
export class UserToolResolver {
  /**
   * User skills list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserTool], { description: 'Get skills list' })
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
   * A user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserTool, { description: 'Get skills list' })
  async userTool(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<UserTool> {
    try {
      const userTool: UserTool = await UserTool.findByPk(where.id);

      return userTool;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserTool, { description: 'Add a user skill' })
  async createUserTool(
    @Arg('skillId', () => ID) skillId: number,
    @Arg('level', () => UserToolLevelEnum) level: UserToolLevelEnum,
    @CurrentUser() authUser: User,
  ): Promise<UserTool> {
    try {
      const userTool: UserTool = await UserTool.create({
        userId: authUser.id,
        skillId,
        level,
      });

      return userTool;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw Error('You have this skill already.');
      }

      throw Error(error.message);
    }
  }

  /**
   * Update a user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserTool, { description: 'Add a user skill' })
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
   * Delete user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number, { description: 'Delete user skill' })
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