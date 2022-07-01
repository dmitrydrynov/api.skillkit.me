import UserSkill from '@entities/user-skill/user-skill.model';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, timestamps: false, tableName: '_user_skill_subskills' })
export default class JuncUserSkillSubSkill extends Model {
  @ForeignKey(() => UserSkill)
  @Column
  parentId: number;

  @ForeignKey(() => UserSkill)
  @Column
  childId: number;
}
