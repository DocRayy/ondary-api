import {
  Column,
  DataType,
  DefaultScope,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "users",
  modelName: "users",
})
@DefaultScope(() => ({
  attributes: {
    exclude: ["password"],
  },
}))
export class User extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  is_verified: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  phone_no: string;

  @Column({ type: DataType.TINYINT, allowNull: true })
  status: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  business_unit_id: number;

  @Column({ type: DataType.TINYINT, allowNull: true })
  role: number;

  @Column({ type: DataType.STRING, allowNull: true })
  url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  file_path: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  is_active: boolean;
}
