import UserKit from '@entities/user-kit/user-kit.model';
import UserSkill from '@entities/user-skill/user-skill.model';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, timestamps: false, tableName: '_user_kit_skills' })
export default class JuncUserKitSkill extends Model {
  @ForeignKey(() => UserKit)
  @Column
  user_kit_id: number;

  @ForeignKey(() => UserSkill)
  @Column
  user_skill_id: number;
}
