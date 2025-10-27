import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { SharpHelper } from "src/cores/helpers/sharp.helper";
import { LocationSubmission } from "../location-submission/entities/location-submission.entity";
import { CreateLocationSubmissionImageDto } from "./dto/create-location-submission-image.dto";
import { UpdateLocationSubmissionImageDto } from "./dto/update-location-submission-image.dto";
import { LocationSubmissionImage } from "./entities/location-submission-image.entity";

@Injectable()
export class LocationSubmissionImageService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    @InjectModel(LocationSubmissionImage)
    private locationSubmissionImageModel: typeof LocationSubmissionImage,
  ) {}

  async create(
    locationSubmission: LocationSubmission,
    createLocationSubmissionImageDto: CreateLocationSubmissionImageDto,
    files: Array<Express.Multer.File>,
  ) {
    if (!files.length) {
      return this.response.fail("Image is required", 400);
    }
    const transaction = await this.sequelize.transaction();
    try {
      const sharpHelper = new SharpHelper();
      for (const [
        index,
        submissionImage,
      ] of createLocationSubmissionImageDto.submission_images.entries()) {
        const file = files[index];
        if (!files[index]) {
          return this.response.fail(`Image at index ${index} is required`, 400);
        }

        const uploadResult = await sharpHelper.resizeAndUpload(
          file,
          this.locationSubmissionImageModel.imageDimension.submissionImage,
        );

        submissionImage.file_path = uploadResult.file_path;
        submissionImage.url = uploadResult.url;
        submissionImage.location_submission_id = locationSubmission.id;
      }

      const submissionImages =
        await this.locationSubmissionImageModel.bulkCreate(
          createLocationSubmissionImageDto.submission_images,
          { transaction },
        );

      await transaction.commit();
      return this.response.success(
        submissionImages,
        201,
        "Successfully create location submission image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(locationSubmission: LocationSubmission, query: any) {
    const { count, data } = await new QueryBuilderHelper(
      this.locationSubmissionImageModel,
      query,
    )
      .where({ location_submission_id: locationSubmission.id })
      .getResult();

    const result = {
      count: count,
      submission_images: data,
    };

    return this.response.success(
      result,
      200,
      "Successfully get location submission images",
    );
  }

  async update(
    locationSubmissionImage: LocationSubmissionImage,
    updateLocationSubmissionImageDto: UpdateLocationSubmissionImageDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await locationSubmissionImage.update(updateLocationSubmissionImageDto, {
        transaction,
      });

      await transaction.commit();
      return this.response.success(
        locationSubmissionImage,
        200,
        "Successfully update location submission image",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(locationSubmissionImage: LocationSubmissionImage) {
    const transaction = await this.sequelize.transaction();
    try {
      if (locationSubmissionImage.file_path) {
        const sharpHelper = new SharpHelper();
        await sharpHelper.delete(
          locationSubmissionImage.file_path,
          this.locationSubmissionImageModel.imageDimension.submissionImage,
        );
      }

      await locationSubmissionImage.destroy({ transaction });
      await transaction.commit();

      return this.response.success(
        {},
        200,
        "Successfully delete location submission image",
      );
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return this.response.fail("Failed delete location submission image", 400);
    }
  }
}
