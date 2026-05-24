import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateTaskFileRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_path?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateTaskFileRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_path?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
