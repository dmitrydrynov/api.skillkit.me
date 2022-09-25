import UserFile from '@entities/user-file/user-file.model';
import UserKit from '@entities/user-kit/user-kit.model';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, timestamps: false, tableName: '_user_kit_files' })
export default class JuncUserKitFile extends Model {
  @ForeignKey(() => UserKit)
  @Column
  userKitId: number;

  @ForeignKey(() => UserFile)
  @Column
  userFileId: number;
}
