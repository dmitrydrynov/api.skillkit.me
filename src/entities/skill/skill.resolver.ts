import { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import Skill from './skill.model';
import { SkillOrderByInput, SkillWhereInput } from './skill.types';

@Resolver()
export class SkillResolver {
  /**
   * Skills list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [Skill], { description: 'Get skills list' })
  async skills(
    @Arg('where', { nullable: true }) where: SkillWhereInput,
    @Arg('orderBy', () => [SkillOrderByInput], { nullable: true }) orderBy: SkillOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
  ): Promise<Array<Skill>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const skills: Skill[] = await Skill.findAll(findOptions);

      return skills;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Skill, { description: 'Get skills list' })
  async createSkill(@Arg('name') name: string): Promise<Skill> {
    try {
      const skill: Skill = await Skill.create({
        name,
      });

      return skill;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
