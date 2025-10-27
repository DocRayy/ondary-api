import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Branch } from "src/features/branch/entities/branch.entity";
import { BusinessUnit } from "src/features/business-unit/entities/business-unit.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "companies",
  modelName: "companies",
})
export class Company extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  note: string;

  @BelongsToMany(() => Branch, {
    as: "branch",
    through: () => BusinessUnit,
  })
  branches: TypeWrapper<Branch[]>;
}
