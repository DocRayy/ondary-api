import { CreateLocationSubmissionImageDto } from "src/features/location-submission-image/dto/create-location-submission-image.dto";

export class CreateLocationSubmissionDto extends CreateLocationSubmissionImageDto {
  gps_lat: string;
  gps_lng: string;
  address?: string;
  note: string;
  status?: number;
}
