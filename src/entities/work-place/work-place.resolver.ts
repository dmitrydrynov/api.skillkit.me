import { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import WorkPlace from './work-place.model';
import { WorkPlaceOrderByInput, WorkPlaceWhereInput } from './work-place.types';

@Resolver()
export class WorkPlaceResolver {
  /**
   * WorkPlaces list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [WorkPlace])
  async workPlaces(
    @Arg('where', { nullable: true }) where: WorkPlaceWhereInput,
    @Arg('orderBy', () => [WorkPlaceOrderByInput], { nullable: true }) orderBy: WorkPlaceOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<WorkPlace>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const workPlaces: WorkPlace[] = await WorkPlace.findAll(findOptions);

      return workPlaces;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a workPlace
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => WorkPlace)
  async createWorkPlace(@Arg('name') name: string): Promise<WorkPlace> {
    try {
      const workPlace: WorkPlace = await WorkPlace.create({
        name,
      });

      return workPlace;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
