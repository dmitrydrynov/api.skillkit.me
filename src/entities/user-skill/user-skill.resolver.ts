import CurrentUser from '@entities/auth/current-user.decorator';
import Skill from '@entities/skill/skill.model';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { DefaultResponseType, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { send } from '@services/mailgun';
import { DateTime } from 'luxon';
import { Arg, Authorized, ID, Mutation, Query, Resolver } from 'type-graphql';
import UserSkill from './user-skill.model';
import {
  UserSkillForShareResponseType,
  UserSkillLevelEnum,
  UserSkillOrderByInput,
  UserSkillUpdateInput,
  UserSkillViewModeEnum,
  UserSkillWhereInput,
  UserSkillsForShareResponseType,
} from './user-skill.types';

@Resolver()
export class UserSkillResolver {
  /**
   * User skills list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserSkill])
  async userSkills(
    @Arg('where', { nullable: true }) where: UserSkillWhereInput,
    @Arg('orderBy', () => [UserSkillOrderByInput], { nullable: true }) orderBy: UserSkillOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
    @CurrentUser() authUser: User,
  ): Promise<Array<UserSkill>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const userSkills: UserSkill[] = await UserSkill.findAll({
        ...findOptions,
        where: {
          ...findOptions.where,
          userId: authUser.id,
        },
        include: [Skill],
      });

      return userSkills;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserSkill)
  async userSkill(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<UserSkill> {
    try {
      const userSkill: UserSkill = await UserSkill.findByPk(where.id);

      return userSkill;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user skill by hash
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserSkill)
  async userSkillByHash(@Arg('hash') hash: string): Promise<UserSkill> {
    try {
      if (!hash) {
        throw Error('Something wrong');
      }

      const [id] = UserSkill.decodeShareLink(hash);

      if (!id) {
        throw Error('Something wrong');
      }

      const userSkill: UserSkill = await UserSkill.findByPk(id);

      return userSkill;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user skill by hash for share
   */
  @Query(() => UserSkillForShareResponseType)
  async userSkillForShare(
    @Arg('hash') hash: string,
    @CurrentUser() authUser: User,
  ): Promise<UserSkillForShareResponseType> {
    try {
      let viewer = authUser ? 'user' : 'guest';

      if (!hash) {
        throw Error('Not actual link');
      }

      const [id] = UserSkill.decodeShareLink(hash);

      if (!id) {
        throw Error('Not actual link');
      }

      const userSkill: UserSkill = await UserSkill.findByPk(id, { include: [User] });

      if (!userSkill) {
        throw Error('Not actual link');
      }

      if (authUser && authUser?.id === userSkill.userId) {
        viewer = 'me';
      }

      // If set mode only me then send user skill data only for owner
      if (viewer !== 'me' && userSkill.viewMode === UserSkillViewModeEnum.ONLY_ME) {
        throw Error('Access denied');
      }

      return { skill: userSkill, user: userSkill.userItem, viewer };
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Get user skills for share
   */
  @Query(() => [UserSkillsForShareResponseType])
  async userSkillsForShare(): Promise<UserSkillsForShareResponseType[]> {
    try {
      const userSkills: UserSkill[] = await UserSkill.findAll({
        where: { viewMode: UserSkillViewModeEnum.EVERYONE },
        include: [User, Skill],
      });

      if (!userSkills) {
        throw Error('Not found public user skills');
      }

      return userSkills.map((userSkill) => ({
        url: userSkill.shareLink,
        skillName: userSkill.skillItem.name,
        userName: userSkill.userItem.fullName,
        level: userSkill.level,
        updatedAt: userSkill.updatedAt,
      }));
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserSkill)
  async createUserSkill(
    @Arg('skillId', () => ID, { nullable: true }) skillId: number,
    @Arg('skillName', { nullable: true }) skillName: string,
    @Arg('level', () => UserSkillLevelEnum) level: UserSkillLevelEnum,
    @CurrentUser() authUser: User,
  ): Promise<UserSkill> {
    try {
      let _skillId = skillId || null;

      if (!_skillId && skillName) {
        const [skill] = await Skill.findOrCreate({
          where: {
            name: skillName.trim().toLowerCase(),
          },
          defaults: {
            name: skillName.trim().toLowerCase(),
          },
        });

        _skillId = skill.id;
      }

      const [userSkill, created] = await UserSkill.findOrCreate({
        where: { skillId: _skillId, userId: authUser.id },
        defaults: {
          userId: authUser.id,
          skillId: _skillId,
          level,
        },
      });

      if (!created) {
        throw Error('You have this skill already.');
      }

      return userSkill;
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
  @Mutation(() => UserSkill)
  async updateUserSkill(
    @Arg('where') where: WhereUniqueInput,
    @Arg('data') data: UserSkillUpdateInput,
    @CurrentUser() authUser: User,
  ): Promise<UserSkill> {
    try {
      const { skillId, skillName } = data;
      const _skillName = skillName ? skillName.trim().toLowerCase() : null;

      const userSkill: UserSkill = await UserSkill.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      if (!skillId && _skillName) {
        let _skillId = skillId || null;

        const [skill] = await Skill.findOrCreate({
          where: {
            name: _skillName,
          },
          defaults: {
            name: _skillName,
          },
        });

        _skillId = skill.id;

        const existedUserSkill: UserSkill = await UserSkill.findOne({
          where: {
            userId: authUser.id,
            skillId: _skillId,
          },
        });

        if (existedUserSkill && existedUserSkill.id !== userSkill.id) {
          throw Error('You have a skill with this name already.');
        }

        data.skillId = _skillId;
      }

      return await userSkill.update(data);
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Publish use skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserSkill)
  async publishUserSkill(
    @Arg('id', () => ID) recordId: number,
    @Arg('host') hostname: string,
    @CurrentUser() authUser: User,
  ): Promise<UserSkill> {
    try {
      const publishedAt = DateTime.now();
      const [effectedCount, userSkills] = await UserSkill.update(
        {
          isDraft: false,
          shareLink: UserSkill.generateShareLink(hostname, recordId, authUser.id, publishedAt.toUnixInteger()),
          publishedAt: publishedAt.toISO(),
          viewMode: UserSkillViewModeEnum.BY_LINK,
        },
        { where: { id: recordId, userId: authUser.id }, returning: true },
      );

      return effectedCount > 0 ? userSkills[0] : null;
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Delete user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number)
  async deleteUserSkill(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<number> {
    try {
      return await UserSkill.destroy({ where: { id: where.id, userId: authUser.id } });
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Add subskills for user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserSkill)
  async addSubSkills(
    @Arg('where') where: WhereUniqueInput,
    @Arg('subSkills', () => [ID], { nullable: true }) subSkills: number[] | null,
    @CurrentUser() authUser: User,
  ): Promise<UserSkill> {
    try {
      const userSkill: UserSkill = await UserSkill.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      await userSkill.addSubSkillItems(subSkills);

      return userSkill;
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Delete subskill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserSkill)
  async deleteSubSkill(
    @Arg('where') where: WhereUniqueInput,
    @Arg('subSkillId', () => ID) subSkillId: number,
    @CurrentUser() authUser: User,
  ): Promise<UserSkill> {
    try {
      const userSkill = await UserSkill.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      await userSkill.removeSubSkillItems([subSkillId]);

      return userSkill;
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Send email to user
   */
  @Mutation(() => DefaultResponseType)
  async sendEmailByHash(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('content') content: string,
    @Arg('hash') hash: string,
  ): Promise<DefaultResponseType> {
    try {
      if (!hash) {
        throw Error('Something wrong');
      }

      const [userSkillId] = UserSkill.decodeShareLink(hash);
      const userSkill = await UserSkill.findByPk(userSkillId, {
        include: [User, Skill],
      });
      const user = userSkill.userItem;

      await send({
        from: `${name} <${email}>`,
        to: `${user.fullName} <${user.email}>`,
        subject: 'New Letter at Skillkit.me',
        body: content,
      });

      await send({
        to: `${name} <${email}>`,
        subject: 'Your email has been successfully sent | Skillkit.me',
        body: `Your email has been sent the letter for owner this skill<br>Interested skill: ${userSkill.skillItem.name}<br>Text your letter:<br>${content}`,
      });

      return { result: true };
    } catch (error) {
      throw Error(error.message);
    }
  }
}
