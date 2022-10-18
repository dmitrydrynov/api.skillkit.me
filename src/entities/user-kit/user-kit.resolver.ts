import CurrentUser from '@entities/auth/current-user.decorator';
import Profession from '@entities/profession/profession.model';
import UserFile from '@entities/user-file/user-file.model';
import UserSkill from '@entities/user-skill/user-skill.model';
import { UserSkillViewModeEnum } from '@entities/user-skill/user-skill.types';
import UserTool from '@entities/user-tool/user-tool.model';
import User, { UserRole } from '@entities/user/user.model';
import { prepareFindOptions } from '@helpers/prepare';
import { DefaultResponseType, WhereUniqueInput } from '@plugins/graphql/types/common.types';
import { send } from '@services/mailgun';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import { Arg, Authorized, ID, Mutation, Query, Resolver } from 'type-graphql';
import UserKit from './user-kit.model';
import {
  UserJobsForKitResponseType,
  UserKitForShareResponseType,
  UserKitOrderByInput,
  UserKitUpdateInput,
  UserKitViewModeEnum,
  UserKitWhereInput,
  UserKitsForShareResponseType,
  UserSchoolsForKitResponseType,
} from './user-kit.types';

@Resolver()
export class UserKitResolver {
  /**
   * User kits list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserKit])
  async userKits(
    @Arg('where', { nullable: true }) where: UserKitWhereInput,
    @Arg('orderBy', () => [UserKitOrderByInput], { nullable: true }) orderBy: UserKitOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
    @CurrentUser() authUser: User,
  ): Promise<Array<UserKit>> {
    try {
      const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

      const userKits: UserKit[] = await UserKit.findAll({
        ...findOptions,
        where: {
          ...findOptions.where,
          userId: authUser.id,
        },
        include: [Profession],
      });

      return userKits;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user kit
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserKit)
  async userKit(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<UserKit> {
    try {
      const userKit: UserKit = await UserKit.findByPk(where.id);

      return userKit;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user kit by hash
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserKit)
  async userKitByHash(@Arg('hash') hash: string): Promise<UserKit> {
    try {
      if (!hash) {
        throw Error('Something wrong');
      }

      const [id] = UserKit.decodeShareLink(hash);

      if (!id) {
        throw Error('Something wrong');
      }

      const userKit: UserKit = await UserKit.findByPk(id);

      return userKit;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user kit by hash for share
   */
  @Query(() => UserKitForShareResponseType)
  async userKitForShare(
    @Arg('hash') hash: string,
    @CurrentUser() authUser: User,
  ): Promise<UserKitForShareResponseType> {
    try {
      let viewer = authUser ? 'user' : 'guest';

      if (!hash) {
        throw Error('Not actual link');
      }

      const [id] = UserKit.decodeShareLink(hash);

      if (!id) {
        throw Error('Not actual link');
      }

      const userKit: UserKit = await UserKit.findByPk(id, { include: [User, UserSkill, Profession] });

      if (!userKit) {
        throw Error('Not actual link');
      }

      if (authUser && authUser?.id === userKit.userId) {
        viewer = 'me';
      }

      // If set mode only me then send user kit data only for owner
      if (viewer !== 'me' && userKit.viewMode === UserKitViewModeEnum.ONLY_ME) {
        throw Error('Access denied');
      }

      return { userKit, user: userKit.userItem, viewer };
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Get user kits for share
   */
  @Query(() => [UserKitsForShareResponseType])
  async userKitsForShare(): Promise<UserKitsForShareResponseType[]> {
    try {
      const userKits: UserKit[] = await UserKit.findAll({
        where: { viewMode: UserKitViewModeEnum.EVERYONE },
        include: [User, Profession],
      });

      if (!userKits) {
        throw Error('Not found public user kits');
      }

      return userKits.map((userKit) => ({
        url: userKit.shareLink,
        kitName: userKit.skillItem.name,
        userName: userKit.userItem.fullName,
        updatedAt: userKit.updatedAt,
      }));
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user kit
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserKit)
  async createUserKit(
    @Arg('professionId', () => ID, { nullable: true }) professionId: number,
    @Arg('professionName', { nullable: true }) professionName: string,
    @Arg('userSkills', () => [ID], { nullable: true }) userSkills: number[] | null,
    @CurrentUser() authUser: User,
  ): Promise<UserKit> {
    try {
      let _professionId = professionId || null;

      if (!_professionId && professionName) {
        const [profession] = await Profession.findOrCreate({
          where: { name: professionName.trim().toLowerCase() },
          defaults: { name: professionName.trim().toLowerCase() },
        });

        _professionId = profession.id;
      }

      const [userKit, created] = await UserKit.findOrCreate({
        where: { professionId: _professionId, userId: authUser.id },
        defaults: {
          userId: authUser.id,
          professionId: _professionId,
        },
      });

      if (!created) {
        throw Error('You have this kit already.');
      }

      if (Array.isArray(userSkills) && userSkills.length > 0) {
        await userKit.addUserSkillItems(userSkills);
      }

      return userKit;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw Error('You have this kit already.');
      }

      throw Error(error.message);
    }
  }

  /**
   * Update a user kit
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserKit)
  async updateUserKit(
    @Arg('where') where: WhereUniqueInput,
    @Arg('data') data: UserKitUpdateInput,
    @CurrentUser() authUser: User,
  ): Promise<UserKit> {
    try {
      const { professionId, professionName } = data;
      const _professionName = professionName ? professionName.trim().toLowerCase() : null;

      const userKit: UserKit = await UserKit.findOne({
        where: {
          id: where.id,
          userId: authUser.id,
        },
      });

      if (!professionId && _professionName) {
        let _professionId = professionId || null;

        const [profession] = await Profession.findOrCreate({
          where: { name: _professionName },
          defaults: { name: _professionName },
        });

        _professionId = profession.id;

        const existedUserKit: UserKit = await UserKit.findOne({
          where: {
            userId: authUser.id,
            professionId: _professionId,
          },
        });

        if (existedUserKit && existedUserKit.id !== userKit.id) {
          throw Error('You have a kit with this name already.');
        }

        data.professionId = _professionId;
      }

      return await userKit.update(data);
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Publish user kit
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserKit)
  async publishUserKit(
    @Arg('id', () => ID) recordId: number,
    @Arg('host') hostname: string,
    @CurrentUser() authUser: User,
  ): Promise<UserKit> {
    try {
      const publishedAt = DateTime.now();
      const [effectedCount, userKits] = await UserKit.update(
        {
          isDraft: false,
          shareLink: UserKit.generateShareLink(hostname, recordId, authUser.id, publishedAt.toUnixInteger()),
          publishedAt: publishedAt.toISO(),
          viewMode: UserKitViewModeEnum.BY_LINK,
        },
        { where: { id: recordId, userId: authUser.id }, returning: true },
      );

      return effectedCount > 0 ? userKits[0] : null;
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Delete user kit
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number)
  async deleteUserKit(@Arg('where') where: WhereUniqueInput, @CurrentUser() authUser: User): Promise<number> {
    try {
      return await UserKit.destroy({ where: { id: where.id, userId: authUser.id } });
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Add user skills for user kit
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserKit)
  async addUserSkillsToKit(
    @Arg('where') where: WhereUniqueInput,
    @Arg('userSkills', () => [ID], { nullable: true }) userSkills: number[] | null,
    @CurrentUser() authUser: User,
  ): Promise<UserKit> {
    try {
      const userKit: UserKit = await UserKit.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      await userKit.addUserSkillItems(userSkills);

      await UserSkill.update(
        {
          viewMode: UserSkillViewModeEnum.BY_LINK,
          isDraft: false,
        },
        {
          individualHooks: true,
          where: {
            id: {
              [Op.in]: userSkills,
            },
            viewMode: UserSkillViewModeEnum.ONLY_ME,
          },
        },
      );

      return userKit;
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }

  /**
   * Delete user skill
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserKit)
  async deleteUserSkillFromKit(
    @Arg('where') where: WhereUniqueInput,
    @Arg('userSkillId', () => ID) userSkillId: number,
    @CurrentUser() authUser: User,
  ): Promise<UserKit> {
    try {
      const userKit = await UserKit.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      await userKit.removeUserSkillItems([userSkillId]);

      return userKit;
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

      const [userKitId] = UserKit.decodeShareLink(hash);
      const userKit = await UserKit.findByPk(userKitId, {
        include: [User, Profession],
      });
      const user = userKit.userItem;

      await send({
        from: `${name} <${email}>`,
        to: `${user.fullName} <${user.email}>`,
        subject: 'New Letter at Skillkit.me',
        body: content,
      });

      await send({
        to: `${name} <${email}>`,
        subject: 'Your email has been successfully sent | Skillkit.me',
        body: `Your email has been sent the letter for owner this skill kit<br>Interested skill kit: ${userKit.professionItem.name}<br>Text your letter:<br>${content}`,
      });

      return { result: true };
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Get skill kit tools
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserTool])
  async getUserToolsForKit(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<Array<UserTool>> {
    try {
      const userKit = await UserKit.findByPk(where.id);

      return await userKit.getUserTools();
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Get skill kit files
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserFile])
  async getUserFilesForKit(@Arg('where', { nullable: true }) where: WhereUniqueInput): Promise<Array<UserFile>> {
    try {
      const userKit = await UserKit.findByPk(where.id);

      return await userKit.userFiles();
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Get skill kit schools
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserSchoolsForKitResponseType])
  async userSchoolsForKit(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
  ): Promise<Array<UserSchoolsForKitResponseType>> {
    try {
      const userKit = await UserKit.findByPk(where.id);

      return await userKit.userSchools();
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Get skill kit jobs
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserJobsForKitResponseType])
  async userJobsForKit(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
  ): Promise<Array<UserJobsForKitResponseType>> {
    try {
      const userKit = await UserKit.findByPk(where.id);

      return await userKit.userJobs();
    } catch (error) {
      throw Error(error.message);
    }
  }
}
