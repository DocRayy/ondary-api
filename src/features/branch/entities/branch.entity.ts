import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { BusinessUnit } from "src/features/business-unit/entities/business-unit.entity";
import { Company } from "src/features/companies/entities/company.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "branches",
  modelName: "branches",
})
export class Branch extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  note: string;

  @BelongsToMany(() => Company, {
    as: "companies",
    through: () => BusinessUnit,
  })
  companies: TypeWrapper<Company[]>;
}
