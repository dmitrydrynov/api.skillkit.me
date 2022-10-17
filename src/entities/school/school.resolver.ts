import { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import School from './school.model';
import { SchoolOrderByInput, SchoolWhereInput } from './school.types';

@Resolver()
export class SchoolResolver {
  /**
   * Schools list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [School])
  async schools(
    @Arg('where', { nullable: true }) where: SchoolWhereInput,
    @Arg('orderBy', () => [SchoolOrderByInput], { nullable: true }) orderBy: SchoolOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<School>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const schools: School[] = await School.findAll(findOptions);

      return schools;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a school
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => School)
  async createSchool(@Arg('name') name: string): Promise<School> {
    try {
      const school: School = await School.create({
        name,
      });

      return school;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
