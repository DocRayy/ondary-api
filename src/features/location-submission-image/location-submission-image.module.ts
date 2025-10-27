import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { LocationSubmissionImage } from "./entities/location-submission-image.entity";
import { LocationSubmissionImageController } from "./location-submission-image.controller";
import { LocationSubmissionImageService } from "./location-submission-image.service";

@Module({
  imports: [SequelizeModule.forFeature([LocationSubmissionImage])],
  controllers: [LocationSubmissionImageController],
  providers: [LocationSubmissionImageService],
})
export class LocationSubmissionImageModule {}
