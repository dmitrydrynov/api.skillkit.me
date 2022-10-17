import { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import WorkTool from './work-tool.model';
import { WorkToolOrderByInput, WorkToolWhereInput } from './work-tool.types';

@Resolver()
export class WorkToolResolver {
  /**
   * WorkTools list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [WorkTool])
  async workTools(
    @Arg('where', { nullable: true }) where: WorkToolWhereInput,
    @Arg('orderBy', () => [WorkToolOrderByInput], { nullable: true }) orderBy: WorkToolOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<WorkTool>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const workTools: WorkTool[] = await WorkTool.findAll(findOptions);

      return workTools;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a workTool
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => WorkTool)
  async createWorkTool(@Arg('name') name: string): Promise<WorkTool> {
    try {
      const workTool: WorkTool = await WorkTool.create({
        name,
      });

      return workTool;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
