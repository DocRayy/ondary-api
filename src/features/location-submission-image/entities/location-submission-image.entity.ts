import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { ResizeOption } from "src/cores/helpers/sharp.helper";
import type { TypeWrapper } from "src/cores/helpers/type-wrapper";
import { LocationSubmission } from "src/features/location-submission/entities/location-submission.entity";

@Table({
  createdAt: "created_at",
  updatedAt: "updated_at",
  timestamps: true,
  tableName: "location_submission_images",
  modelName: "location_submission_images",
})
export class LocationSubmissionImage extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => LocationSubmission)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  location_submission_id: number;

  @BelongsTo(() => LocationSubmission)
  location_submission: TypeWrapper<LocationSubmission>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_path: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note: string;

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
