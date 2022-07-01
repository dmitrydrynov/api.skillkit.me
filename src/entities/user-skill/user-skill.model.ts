import { env } from 'process';
import JuncUserSkillFile from '@entities/junc-user-skill-file/junc-user-skill-file.model';
import Skill from '@entities/skill/skill.model';
import UserFile from '@entities/user-file/user-file.model';
import UserJob from '@entities/user-job/user-job.model';
import { ExperienceResponse } from '@entities/user-job/user-job.types';
import UserSchool from '@entities/user-school/user-school.model';
import { UserSkillLevelEnum, UserSkillViewModeEnum } from '@entities/user-skill/user-skill.types';
import UserTool from '@entities/user-tool/user-tool.model';
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
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';

const hashids = new Hashids(env.HASH_SALT, 16);

@ObjectType('UserSkill')
@Table({ underscored: true })
export default class UserSkill extends Model {
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

  @ForeignKey(() => Skill)
  @Column
  skillId: number;

  @BelongsTo(() => Skill)
  skillItem: Skill;

  @Field(() => Skill)
  async skill() {
    return await this.getSkillItem();
  }

  @Field(() => UserSkillLevelEnum)
  @Column
  level: UserSkillLevelEnum;

  @HasMany(() => UserTool)
  userToolItems: UserTool[];

  @HasMany(() => UserSchool)
  userSchoolItems: UserSchool[];

  @HasMany(() => UserJob)
  userJobItems: UserJob[];

  @BelongsToMany(() => UserFile, () => JuncUserSkillFile)
  userFileItems: UserFile[];

  @Field(() => [UserTool])
  async tools() {
    return await this.getUserToolItems();
  }

  @Field(() => [UserSchool])
  async schools() {
    return await this.getUserSchoolItems();
  }

  @Field(() => [UserJob])
  async jobs() {
    return await this.getUserJobItems();
  }

  @Field(() => [UserFile])
  async files() {
    return await this.getUserFileItems();
  }

  @Field(() => ExperienceResponse)
  async experience(): Promise<ExperienceResponse> {
    const jobs: UserJob[] = await this.getUserJobItems();
    let minDate = null;
    let maxDate = null;

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

    if (!maxDate || !minDate) {
      return { years: 0, months: 0 };
    }

    const diff = maxDate.diff(minDate, ['years', 'months']).toObject();

    return { years: Math.round(diff.years), months: Math.round(diff.months) };
  }

  @Field()
  @AllowNull(false)
  @Default(true)
  @Column
  isDraft: boolean;

  @Field()
  @AllowNull(false)
  @Column({ defaultValue: UserSkillViewModeEnum.ONLY_ME })
  viewMode: UserSkillViewModeEnum;

  @Field({ nullable: true })
  @Column
  shareLink: string;

  @Field({ nullable: true })
  @Column
  description?: string;

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

    return `${hostname}/s/${linkHash}`;
  };

  static decodeShareLink = (hash: string) => {
    return hashids.decode(hash) as number[];
  };
}
