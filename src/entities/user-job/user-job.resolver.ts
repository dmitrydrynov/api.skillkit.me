import CurrentUser from '@entities/auth/current-user.decorator';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import UserJob from './user-job.model';
import { UserJobCreateInput, UserJobOrderByInput, UserJobUpdateInput, UserJobWhereInput } from './user-job.types';

@Resolver()
export class UserJobResolver {
  /**
   * User jobs list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserJob])
  async userJobs(
    @Arg('where', { nullable: true }) where: UserJobWhereInput,
    @Arg('orderBy', () => [UserJobOrderByInput], { nullable: true }) orderBy: UserJobOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
    @CurrentUser() authUser: User,
  ): Promise<Array<UserJob>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const userJobs: UserJob[] = await UserJob.findAll({
        ...findOptions,
        where: {
          ...findOptions.where,
          userId: authUser.id,
        },
      });

      return userJobs;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user job
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserJob)
  async userJob(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<UserJob> {
    try {
      const userJob: UserJob = await UserJob.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return userJob;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user job
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserJob)
  async createUserJob(@Arg('data') data: UserJobCreateInput, @CurrentUser() authUser: User): Promise<UserJob> {
    try {
      const { title, position, description, userSkillId, startedAt, finishedAt } = data;

      const [userJob, created] = await UserJob.findOrCreate({
        where: {
          userId: authUser.id,
          title,
        },
        defaults: {
          userId: authUser.id,
          userSkillId,
          title,
          position,
          description,
          startedAt,
          finishedAt,
        },
      });

      if (!created) {
        throw Error('You have this job already. Select it from jobs list.');
      }

      return userJob;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Update a user job
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserJob)
  async updateUserJob(
    @Arg('where') where: WhereUniqueInput,
    @Arg('data') data: UserJobUpdateInput,
    @CurrentUser() authUser: User,
  ): Promise<UserJob> {
    try {
      const userJob: UserJob = await UserJob.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return await userJob.update(data);
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Delete user job
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number)
  async deleteUserJob(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<number> {
    try {
      return await UserJob.destroy({ where: { id: where.id, userId: authUser.id } });
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }
}
