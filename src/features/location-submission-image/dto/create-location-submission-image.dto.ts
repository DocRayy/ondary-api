export class CreateLocationSubmissionImageDto {
  submission_images: Array<{
    file_path: string;
    url: string;
    note: string;
    location_submission_id: number;
  }>;
}
