import { registerEnumType } from 'type-graphql';

export enum SkillLevelEnum {
  NOVICE = 'Novice',
  BEGINNER = 'Beginner',
  SKILLFUL = 'Skillful',
  EXPERIENCED = 'Experienced',
  EXPERT = 'Expert',
}

registerEnumType(SkillLevelEnum, {
  name: 'SkillLevelEnum',
});
