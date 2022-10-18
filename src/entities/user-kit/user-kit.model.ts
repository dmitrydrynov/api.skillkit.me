import { env } from 'process';
import JuncUserKitFile from '@entities/juncs/junc-user-kit-file.model';
import JuncUserKitSkills from '@entities/juncs/junc-user-kit-skills.model';
import Profession from '@entities/profession/profession.model';
import School from '@entities/school/school.model';
import UserFile from '@entities/user-file/user-file.model';
import UserJob from '@entities/user-job/user-job.model';
import { ExperienceResponse } from '@entities/user-job/user-job.types';
import UserSchool from '@entities/user-school/user-school.model';
import UserSkill from '@entities/user-skill/user-skill.model';
import { UserSkillViewModeEnum } from '@entities/user-skill/user-skill.types';
import UserTool from '@entities/user-tool/user-tool.model';
import User from '@entities/user/user.model';
import WorkPlace from '@entities/work-place/work-place.model';
import Hashids from 'hashids';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  CollectedUserJobResponseType,
  UserJobsForKitResponseType,
  UserKitViewModeEnum,
  UserSchoolsForKitResponseType,
} from './user-kit.types';

const hashids = new Hashids(env.HASH_SALT, 16);

@ObjectType('UserKit')
@Table({ underscored: true })
export default class UserKit extends Model {
  [x: string]: any;

  @Field(() => ID)
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  userItem: User;

  @Field(() => User)
  async user() {
    return await this.getUserItem();
  }

  @ForeignKey(() => Profession)
  @Column
  professionId: number;

  @BelongsTo(() => Profession)
  professionItem: Profession;

  @Field(() => Profession)
  async profession() {
    return await this.getProfessionItem();
  }

  @BelongsToMany(() => UserSkill, () => JuncUserKitSkills, 'user_kit_id', 'user_skill_id')
  userSkillItems: UserSkill[];

  @Field(() => [UserSkill])
  async userSkills() {
    return await this.getUserSkillItems();
  }

  @Field()
  @AllowNull(false)
  @Default(true)
  @Column
  isDraft: boolean;

  @Field()
  @AllowNull(false)
  @Column({ defaultValue: UserKitViewModeEnum.ONLY_ME })
  viewMode: UserKitViewModeEnum;

  @Field({ nullable: true })
  @Column
  shareLink: string;

  @Field({ nullable: true })
  @Column
  description?: string;

  @BelongsToMany(() => UserFile, () => JuncUserKitFile)
  userFileItems: UserFile[];

  @Field(() => [UserFile])
  async files() {
    return await this.getUserFileItems();
  }

  @Field({ nullable: true })
  @Column
  publishedAt: Date;

  @Field()
  @AllowNull(false)
  @CreatedAt
  @Column
  createdAt: Date;

  @Field()
  @AllowNull(false)
  @UpdatedAt
  @Column
  updatedAt: Date;

  static generateShareLink = (hostname: string, ...args: number[]) => {
    const linkHash = hashids.encode(args);

    return `${hostname}/sk/${linkHash}`;
  };

  static decodeShareLink = (hash: string) => {
    return hashids.decode(hash) as number[];
  };

  @Field(() => ExperienceResponse)
  async experience(): Promise<ExperienceResponse> {
    const userSkills: UserSkill[] = await this.getUserSkillItems();
    let minDate = null;
    let maxDate = null;

    if (userSkills.length == 0) {
      return { years: 0, months: 0 };
    }

    await Promise.all(
      userSkills.map(async (userSkill) => {
        const jobs: UserJob[] = await userSkill.getUserJobItems();

        jobs.map((job) => {
          const startedAt = DateTime.fromJSDate(job.startedAt);
          const finishedAt = job.finishedAt ? DateTime.fromJSDate(job.finishedAt) : DateTime.now();

          if (!minDate) {
            minDate = startedAt;
          }

          if (!maxDate) {
            maxDate = finishedAt;
          }

          if (minDate && maxDate) {
            if (minDate.toMillis() > startedAt.toMillis()) {
              minDate = startedAt;
            }

            if (maxDate.toMillis() < finishedAt.toMillis()) {
              maxDate = finishedAt;
            }
          }
        });
      }),
    );

    if (!minDate || !maxDate) {
      return { years: 0, months: 0 };
    }

    const diff = maxDate.diff(minDate, ['years', 'months']).toObject();

    return { years: Math.round(diff.years), months: Math.round(diff.months) };
  }

  @Field(() => [UserTool])
  async userTools() {
    try {
      const userSkills = await this.getUserSkillItems();
      const ids: number[] = userSkills
        .filter((us) => us.viewMode !== UserSkillViewModeEnum.ONLY_ME)
        .map((userSkill) => userSkill.id);

      const userSkillTools = await UserTool.findAll({
        where: {
          userSkillId: {
            [Op.in]: ids,
          },
        },
      });

      return userSkillTools;
    } catch (error) {
      return [];
    }
  }

  @Field(() => [UserJobsForKitResponseType])
  async userJobs(): Promise<UserJobsForKitResponseType[]> {
    try {
      const collectedUserJobs = [];
      const userSkills: UserSkill[] = await this.getUserSkillItems();
      const ids: number[] = userSkills
        .filter((us) => us.viewMode !== UserSkillViewModeEnum.ONLY_ME)
        .map((userSkill) => userSkill.id);
      const userSkillJobs = await UserJob.findAll({
        include: [WorkPlace],
        where: {
          userSkillId: {
            [Op.in]: ids,
          },
        },
      });

      userSkillJobs.map((userSkillJob: UserJob) => {
        const duplicates = userSkillJobs.filter((uss) => uss.workPlaceId === userSkillJob.workPlaceId);

        if (collectedUserJobs.filter((cos) => cos.workPlaceId === userSkillJob.workPlaceId).length === 0) {
          collectedUserJobs.push({
            workPlaceId: userSkillJob.workPlaceId,
            name: userSkillJob.workPlaceItem.name,
            userJobs: duplicates,
          });
        }
      });

      return collectedUserJobs;
    } catch (error) {
      return [];
    }
  }

  @Field(() => [UserSchoolsForKitResponseType])
  async userSchools(): Promise<UserSchoolsForKitResponseType[]> {
    try {
      const collectedUserSchools = [];
      const userSkills = await this.getUserSkillItems();
      const ids: number[] = userSkills
        .filter((us) => us.viewMode !== UserSkillViewModeEnum.ONLY_ME)
        .map((userSkill) => userSkill.id);
      const userSkillSchools = await UserSchool.findAll({
        include: [School],
        where: {
          userSkillId: {
            [Op.in]: ids,
          },
        },
      });

      userSkillSchools.map((userSkillSchool: UserSchool) => {
        const duplicates = userSkillSchools.filter((uss) => uss.schoolId === userSkillSchool.schoolId);

        if (collectedUserSchools.filter((cos) => cos.schoolId === userSkillSchool.schoolId).length === 0) {
          collectedUserSchools.push({
            schoolId: userSkillSchool.schoolId,
            name: userSkillSchool.schoolItem.name,
            userSchools: duplicates,
          });
        }
      });

      return collectedUserSchools;
    } catch (error) {
      return [];
    }
  }

  @Field(() => [UserFile])
  async userFiles(): Promise<UserFile[]> {
    {
      const userSkills: UserSkill[] = await this.getUserSkillItems();
      const promises = await Promise.all(
        userSkills
          .filter((us) => us.viewMode !== UserSkillViewModeEnum.ONLY_ME)
          .map(async (userSkill) => {
            const userSkillFiles: UserFile[] = await userSkill.getUserFileItems();
            const ids: number[] = userSkillFiles.map((userFile) => userFile.id);

            return ids;
          }),
      );

      let userFileIds: number[] = [].concat(...promises);
      /** remove duplucates */
      userFileIds = userFileIds.filter((item, index) => userFileIds.indexOf(item) === index);

      const userSkillFiles = await UserFile.findAll({
        where: {
          id: {
            [Op.in]: userFileIds,
          },
        },
      });

      return userSkillFiles;
    }
  }
}
