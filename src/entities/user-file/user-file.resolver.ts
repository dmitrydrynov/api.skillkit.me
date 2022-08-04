import { env } from '@config/env';
import CurrentUser from '@entities/auth/current-user.decorator';
import UserSkill from '@entities/user-skill/user-skill.model';
import User, { UserRole } from '@entities/user/user.model';
import { removeFile, uploadFile } from '@helpers/file';
import { prepareFindOptions } from '@helpers/prepare';
import { WhereUniqueInput } from '@plugins/graphql/types/common.types';
import Hashids from 'hashids';
import { MercuriusContext } from 'mercurius';
import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';
import UserFile, { UserFileType } from './user-file.model';
import { UserFileCreateInput, UserFileOrderByInput, UserFileUpdateInput, UserFileWhereInput } from './user-file.types';

const hashids = new Hashids(env.HASH_SALT, 16);

@Resolver()
export class UserFileResolver {
  /**
   * User files list
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => [UserFile])
  async userFiles(
    @Arg('attachType', { nullable: true }) attachType: string,
    @Arg('attachId', () => ID, { nullable: true }) attachId: number,
    @Arg('where', { nullable: true }) where: UserFileWhereInput,
    @Arg('orderBy', () => [UserFileOrderByInput], { nullable: true }) orderBy: UserFileOrderByInput[],
    @Arg('take', { nullable: true }) take: number,
    @Arg('skip', { nullable: true }) skip: number,
    @CurrentUser() authUser: User,
  ): Promise<Array<UserFile>> {
    let userFiles: UserFile[] = null;

    try {
      if (attachType === 'UserSkill') {
        const userSkill = await UserSkill.findByPk(attachId);
        userFiles = await userSkill.getUserFileItems();
      } else {
        const findOptions: any = prepareFindOptions(where, take, skip, orderBy);

        userFiles = await UserFile.findAll({
          ...findOptions,
          where: {
            ...findOptions.where,
            userId: authUser.id,
          },
        });
      }

      return userFiles;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * A user file
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Query(() => UserFile)
  async userFile(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
  ): Promise<UserFile> {
    try {
      const userFile: UserFile = await UserFile.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      return userFile;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Add a user file
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserFile)
  async createUserFile(
    @Arg('data') data: UserFileCreateInput,
    @CurrentUser() authUser: User,
    @Ctx() ctx: MercuriusContext,
  ): Promise<UserFile> {
    try {
      const { title, file, description, attachTo, attachId, type, url } = data;

      const createData: any = {
        userId: authUser.id,
        title,
        description,
      };

      if (type == UserFileType.FILE) {
        if (!file) {
          throw Error("The file wasn't loaded");
        }

        const fileName = 'file-' + hashids.encode(authUser.id, Date.now());
        const fileUrl = await uploadFile(ctx.app, file, 'files', fileName);

        createData.type = UserFileType.FILE;
        createData.url = fileUrl;
      }

      if (type == UserFileType.LINK) {
        if (!url) {
          throw Error("The url wasn't added");
        }

        createData.type = UserFileType.LINK;
        createData.url = url;
      }

      const userFile = await UserFile.create(createData);

      if (!userFile) {
        throw Error(`The ${type} wasn't loaded. Something wrong!`);
      }

      if (attachTo === 'userSkill') {
        const userSkill = await UserSkill.findOne({ where: { id: attachId } });

        userFile.addUserSkill(userSkill);
      }

      return userFile;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Update a user file
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => UserFile)
  async updateUserFile(
    @Arg('where') where: WhereUniqueInput,
    @Arg('data') data: UserFileUpdateInput,
    @CurrentUser() authUser: User,
    @Ctx() ctx: MercuriusContext,
  ): Promise<UserFile> {
    try {
      const userFile: UserFile = await UserFile.findOne({
        where: {
          userId: authUser.id,
          id: where.id,
        },
      });

      if (!userFile) {
        throw Error('The user file not found');
      }

      const { file, ...dataForUpdate } = data;

      // update file
      if (file) {
        if (userFile.url) {
          await removeFile(ctx.app, userFile.url);
        }

        const fileName = 'file-' + hashids.encode(userFile.id, authUser.id, Date.now());
        const uploadedFile = await uploadFile(ctx.app, file, 'files', fileName);
        userFile.url = uploadedFile.url;
      }

      // remove file
      if (file === null && userFile.url) {
        await removeFile(ctx.app, userFile.avatar);
        userFile.avatar = null;
      }

      userFile.set(dataForUpdate);

      return await userFile.save();
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Delete user file
   */
  @Authorized([UserRole.MEMBER, UserRole.EXPERT, UserRole.OPERATOR, UserRole.ADMIN])
  @Mutation(() => Number)
  async deleteUserFile(
    @Arg('where', { nullable: true }) where: WhereUniqueInput,
    @CurrentUser() authUser: User,
    @Ctx() ctx: MercuriusContext,
  ): Promise<number> {
    try {
      const item = await UserFile.findOne({ where: { id: where.id, userId: authUser.id } });

      if (!item) {
        throw Error("User File doesn't found");
      }

      await removeFile(ctx.app, item.url);

      return await UserFile.destroy({ where: { id: where.id, userId: authUser.id } });
    } catch (error) {
      console.log(error);
      throw Error(error.message);
    }
  }
}
