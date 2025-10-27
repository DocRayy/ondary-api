import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationSubmissionDto } from './create-location-submission.dto';

export class UpdateLocationSubmissionDto extends PartialType(CreateLocationSubmissionDto) {}
