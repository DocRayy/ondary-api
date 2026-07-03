import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateTaskAttachmentRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;
}

export class UpdateTaskAttachmentRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  files?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  original_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  mime_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  size?: number;
}
