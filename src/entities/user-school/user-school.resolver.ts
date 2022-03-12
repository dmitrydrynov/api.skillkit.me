import CurrentUser from '@entities/auth/current-user.decorator';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import UserSchool from './user-school.model';
import {
  UserSchoolCreateInput,
  UserSchoolOrderByInput,
  UserSchoolUpdateInput,
  UserSchoolWhereInput,
} from './user-school.types';

@Resolver()
export class UserSchoolResolver {
  /**
   * User schools list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserSchool])
  async userSchools(
    @Arg('where', { nullable: true }) where: UserSchoolWhereInput,
    @Arg('orderBy', () => [UserSchoolOrderByInput], { nullable: true }) orderBy: UserSchoolOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
    @CurrentUser() authUser: User,
  ): Promise<Array<UserSchool>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const userSchools: UserSchool[] = await UserSchool.findAll({
        ...findOptions,
        where: {
          ...findOptions.where,
          userId: authUser.id,
        },
      });

      return userSchools;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user school
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserSchool)
  async userSchool(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<UserSchool> {
    try {
      const userSchool: UserSchool = await UserSchool.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return userSchool;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user school
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserSchool)
  async createUserSchool(@Arg('data') data: UserSchoolCreateInput, @CurrentUser() authUser: User): Promise<UserSchool> {
    try {
      const { title, description, userSkillId, startedAt, finishedAt } = data;

      const [userSchool, created] = await UserSchool.findOrCreate({
        where: {
          userId: authUser.id,
          title,
        },
        defaults: {
          userId: authUser.id,
          userSkillId,
          title,
          description,
          startedAt,
          finishedAt,
        },
      });

      if (!created) {
        throw Error('You have this school already. Select it from schools list.');
      }

      return userSchool;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Update a user school
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserSchool)
  async updateUserSchool(
    @Arg('where') where: WhereUniqueInput,
    @Arg('data') data: UserSchoolUpdateInput,
    @CurrentUser() authUser: User,
  ): Promise<UserSchool> {
    try {
      const userSchool: UserSchool = await UserSchool.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return await userSchool.update(data);
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Delete user school
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number)
  async deleteUserSchool(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<number> {
    try {
      return await UserSchool.destroy({ where: { id: where.id, userId: authUser.id } });
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }
}
