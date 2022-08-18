import { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import Profession from './profession.model';
import { ProfessionOrderByInput, ProfessionWhereInput } from './profession.types';

@Resolver()
export class ProfessionResolver {
  /**
   * Professions list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [Profession])
  async professions(
    @Arg('where', { nullable: true }) where: ProfessionWhereInput,
    @Arg('orderBy', () => [ProfessionOrderByInput], { nullable: true }) orderBy: ProfessionOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<Profession>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const skills: Profession[] = await Profession.findAll(findOptions);

      return skills;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a profession
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Profession)
  async createProfession(@Arg('name') name: string): Promise<Profession> {
    try {
      const profession = await Profession.create({
        name,
      });

      return profession;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
