import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { Branch } from "src/features/branch/entities/branch.entity";
import { Company } from "src/features/companies/entities/company.entity";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  tableName: "business_units",
  modelName: "business_units",
})
export class BusinessUnit extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Company)
  @Column(DataType.BIGINT)
  company_id: number;

  @ForeignKey(() => Branch)
  @Column(DataType.BIGINT)
  branch_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code: string;

  @BelongsTo(() => Company)
  company: TypeWrapper<Company>;

  @BelongsTo(() => Branch)
  branch: TypeWrapper<Branch>;
}
