import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { LocationSubmission } from "../location-submission/entities/location-submission.entity";
import { locationSubmissionIdParamSchema } from "../location-submission/validations/params/location-submissions-id.param";
import { CreateLocationSubmissionImageDto } from "./dto/create-location-submission-image.dto";
import { UpdateLocationSubmissionImageDto } from "./dto/update-location-submission-image.dto";
import { LocationSubmissionImage } from "./entities/location-submission-image.entity";
import { LocationSubmissionImageService } from "./location-submission-image.service";
import { locationSubmissionImageIdParamSchema } from "./validations/params/location-submission-image-id.param";
import { createLocationSubmissionImageSchema } from "./validations/requests/create-location-submission-image.request";
import { updateLocationSubmissionImageSchema } from "./validations/requests/update-location-submission-image.request";

@Controller()
export class LocationSubmissionImageController {
  constructor(
    private readonly locationSubmissionImageService: LocationSubmissionImageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Param(
      "submissionId",
      new JoiValidationParamPipe(locationSubmissionIdParamSchema),
    )
    locationSubmission: LocationSubmission,
    @Body(new JoiValidationPipe(createLocationSubmissionImageSchema))
    createLocationSubmissionImageDto: CreateLocationSubmissionImageDto,
    @UploadedFiles()
    file: Array<Express.Multer.File>,
  ) {
    return this.locationSubmissionImageService.create(
      locationSubmission,
      createLocationSubmissionImageDto,
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param(
      "submissionId",
      new JoiValidationParamPipe(locationSubmissionIdParamSchema),
    )
    locationSubmission: LocationSubmission,
    @Query() query,
  ) {
    return this.locationSubmissionImageService.findAll(
      locationSubmission,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param(new JoiValidationParamPipe(locationSubmissionImageIdParamSchema))
    locationSubmissionImage: LocationSubmissionImage,
    @Body(new JoiValidationPipe(updateLocationSubmissionImageSchema))
    updateLocationSubmissionImageDto: UpdateLocationSubmissionImageDto,
  ) {
    return this.locationSubmissionImageService.update(
      locationSubmissionImage,
      updateLocationSubmissionImageDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param(new JoiValidationParamPipe(locationSubmissionImageIdParamSchema))
    locationSubmissionImage: LocationSubmissionImage,
  ) {
    return this.locationSubmissionImageService.remove(locationSubmissionImage);
  }
}
