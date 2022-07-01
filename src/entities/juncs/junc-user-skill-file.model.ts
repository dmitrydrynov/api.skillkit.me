import UserFile from '@entities/user-file/user-file.model';
import UserSkill from '@entities/user-skill/user-skill.model';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, timestamps: false, tableName: '_user_skill_files' })
export default class JuncUserSkillFile extends Model {
  @ForeignKey(() => UserSkill)
  @Column
  userSkillId: number;

  @ForeignKey(() => UserFile)
  @Column
  userFileId: number;
}
