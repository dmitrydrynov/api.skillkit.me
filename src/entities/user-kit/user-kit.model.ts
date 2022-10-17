import { env } from 'process';
import JuncUserKitFile from '@entities/juncs/junc-user-kit-file.model';
import JuncUserKitSkills from '@entities/juncs/junc-user-kit-skills.model';
import Profession from '@entities/profession/profession.model';
import UserFile from '@entities/user-file/user-file.model';
import UserJob from '@entities/user-job/user-job.model';
import { ExperienceResponse } from '@entities/user-job/user-job.types';
import UserSkill from '@entities/user-skill/user-skill.model';
import User from '@entities/user/user.model';
import Hashids from 'hashids';
import { DateTime } from 'luxon';
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
import { UserKitViewModeEnum } from './user-kit.types';

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

  // @Field(() => ExperienceResponse)
  // async experience(): Promise<ExperienceResponse> {
  //   let collectedMonths = 0;
  //   const userSkills = await this.getUserSkillItems();

  //   await Promise.all(
  //     userSkills.map(async (userSkill) => {
  //       const experience = await userSkill.experience();
  //       collectedMonths += experience.years * 12 + experience.months;
  //     }),
  //   );

  //   const years = Math.round(collectedMonths / 12);
  //   const months = collectedMonths - years * 12;

  //   return { years, months };
  // }

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
}
