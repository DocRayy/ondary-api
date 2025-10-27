import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { LocationSubmission } from "./entities/location-submission.entity";
import { LocationSubmissionController } from "./location-submission.controller";
import { LocationSubmissionService } from "./location-submission.service";

@Module({
  imports: [SequelizeModule.forFeature([LocationSubmission])],
  controllers: [LocationSubmissionController],
  providers: [LocationSubmissionService],
})
export class LocationSubmissionModule {}
