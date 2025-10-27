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
import { CurrentUser } from "src/cores/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { User } from "../user/entities/user.entity";
import { CreateLocationSubmissionDto } from "./dto/create-location-submission.dto";
import { UpdateLocationSubmissionDto } from "./dto/update-location-submission.dto";
import { LocationSubmission } from "./entities/location-submission.entity";
import { LocationSubmissionService } from "./location-submission.service";
import { locationSubmissionIdParamSchema } from "./validations/params/location-submissions-id.param";
import { createLocationSubmissionSchema } from "./validations/requests/create-location-submission.request";

@Controller()
export class LocationSubmissionController {
  constructor(
    private readonly locationSubmissionService: LocationSubmissionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new JoiValidationPipe(createLocationSubmissionSchema))
    createLocationSubmissionDto: CreateLocationSubmissionDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.locationSubmissionService.create(
      createLocationSubmissionDto,
      user,
      files,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: User, @Query() query) {
    return this.locationSubmissionService.findAll(user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(locationSubmissionIdParamSchema))
    locationSubmission: LocationSubmission,
  ) {
    return this.locationSubmissionService.findOne(locationSubmission);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new JoiValidationParamPipe(locationSubmissionIdParamSchema))
    locationSubmission: LocationSubmission,
    @Body(new JoiValidationPipe(createLocationSubmissionSchema))
    updateLocationSubmissionDto: UpdateLocationSubmissionDto,
  ) {
    return this.locationSubmissionService.update(
      locationSubmission,
      updateLocationSubmissionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(locationSubmissionIdParamSchema))
    locationSubmission: LocationSubmission,
  ) {
    return this.locationSubmissionService.remove(locationSubmission);
  }
}
