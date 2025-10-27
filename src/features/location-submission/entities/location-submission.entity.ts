import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ResizeOption } from "src/cores/helpers/sharp.helper";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { BusinessUnit } from "src/features/business-unit/entities/business-unit.entity";
import { LocationSubmissionImage } from "src/features/location-submission-image/entities/location-submission-image.entity";
import { User } from "src/features/user/entities/user.entity";
import { getSubmissionStatusLabel } from "../enums/submission-status.enum";

@Table({
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  paranoid: true,
  tableName: "location_submissions",
  modelName: "location_submissions",
})
export class LocationSubmission extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, autoIncrement: true })
  id: number;

  @ForeignKey(() => BusinessUnit)
  @Column({ type: DataType.BIGINT, allowNull: true })
  business_unit_id: number;

  @BelongsTo(() => BusinessUnit, {
    foreignKey: "business_unit_id",
  })
  business_unit: TypeWrapper<BusinessUnit>;

  @Column({ type: DataType.STRING, allowNull: false })
  gps_lat: string;

  @Column({ type: DataType.STRING, allowNull: false })
  gps_lng: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  note: string;

  @Column({ type: DataType.TINYINT, allowNull: true, defaultValue: 0 })
  status: number;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return getSubmissionStatusLabel(this.getDataValue("status"));
    },
  })
  status_name: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  created_by: number;

  @BelongsTo(() => User, {
    foreignKey: "created_by",
  })
  created_by_user: TypeWrapper<User>;

  @HasMany(() => LocationSubmissionImage)
  submission_images: TypeWrapper<LocationSubmissionImage[]>;

  static imageDimension: { submissionImage: ResizeOption } = {
    submissionImage: {
      dimensions: [
        {
          width: 100,
          fit: "inside",
          prefix: "100",
        },
        {
          width: 300,
          fit: "inside",
          prefix: "300",
        },
      ],
      path: "submission/images",
    },
  };
}
