import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { User } from "src/features/user/entities/user.entity";
import { LocationSubmissionImage } from "../location-submission-image/entities/location-submission-image.entity";
import UserRoleEnum from "../user/enums/user-role.enum";
import { CreateLocationSubmissionDto } from "./dto/create-location-submission.dto";
import { UpdateLocationSubmissionDto } from "./dto/update-location-submission.dto";
import { LocationSubmission } from "./entities/location-submission.entity";
import { getSubmissionStatusLabel } from "./enums/submission-status.enum";

@Injectable()
export class LocationSubmissionService {
  constructor(
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(LocationSubmission)
    private readonly locationSubmissionModel: typeof LocationSubmission,
  ) {}

  async create(
    createLocationSubmissionDto: CreateLocationSubmissionDto,
    user: User,
    files: Array<Express.Multer.File>,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const submissionImageInstances = [];
      const data = [];
      const sharpHelper = new SharpHelper();
      for (const [index, file] of files.entries()) {
        const uploadFile = sharpHelper
          .resizeAndUpload(
            file,
            LocationSubmission.imageDimension.submissionImage,
          )
          .then((value) => {
            let note = "";
            if (createLocationSubmissionDto?.submission_images[index]?.note) {
              note =
                createLocationSubmissionDto?.submission_images[index]?.note;
            }

            data.push({
              url: value.url,
              file_path: value.file_path,
              note: note,
            });
          });

        submissionImageInstances.push(uploadFile);
      }

      await Promise.all(submissionImageInstances);

      const locationSubmission = await this.locationSubmissionModel.create(
        {
          ...createLocationSubmissionDto,
          business_unit_id: user.business_unit_id,
          created_by: user.id,
          submission_images: data,
        },
        {
          transaction,
          include: ["submission_images"],
        },
      );

      await transaction.commit();
      return this.response.success(
        locationSubmission,
        201,
        "Successfully create location submission",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(user: User, query: any) {
    const condition = {};
    if (user.role === UserRoleEnum.MANAGER) {
      Object.assign(condition, {
        "$location_submissions.business_unit_id$": user.business_unit_id,
      });
    } else if (user.role === UserRoleEnum.USER) {
      Object.assign(condition, {
        "$location_submissions.created_by$": user.id,
      });
    }

    try {
      const { count, data } = await new QueryBuilderHelper(
        this.locationSubmissionModel,
        query,
      )
        .where(condition)
        .load("created_by_user")
        .getResult();

      const locationSubmissionImages = await LocationSubmissionImage.findAll({
        where: {
          location_submission_id: data.map((submission) => submission.id),
        },
      });

      for (const submission of data) {
        const locationSubmissionImage = locationSubmissionImages.filter(
          (image) => image.location_submission_id === submission.id,
        );

        submission.submission_images = locationSubmissionImage;
      }

      const result = {
        count,
        location_submissions: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get location submissions",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(locationSubmission: LocationSubmission) {
    try {
      await locationSubmission.reload({
        include: [
          {
            association: "submission_images",
          },
          {
            association: "created_by_user",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      return this.response.success(
        locationSubmission,
        200,
        "Successfully get location submission",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async update(
    locationSubmission: LocationSubmission,
    updateLocationSubmissionDto: UpdateLocationSubmissionDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (locationSubmission.status !== updateLocationSubmissionDto.status) {
        this.eventEmitter.emit("notification", ["system"], {
          type: "LOCATION SUBMISSION",
          data: { id: locationSubmission.id },
          notified_user_id: locationSubmission.created_by,
          message: `Submission status Change from ${locationSubmission.status_name} to ${getSubmissionStatusLabel(+updateLocationSubmissionDto.status)}`,
          title: "Update Submission Status",
        });
      }
      await locationSubmission.update(updateLocationSubmissionDto, {
        transaction,
      });
      await transaction.commit();
      return this.response.success(
        locationSubmission,
        200,
        "Successfully update location submission",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(locationSubmission: LocationSubmission) {
    const transaction = await this.sequelize.transaction();
    try {
      await locationSubmission.destroy({ transaction });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        "Successfully delete location submission",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
