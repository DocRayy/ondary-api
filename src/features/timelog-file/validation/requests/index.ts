import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateTimelogFileRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  timelog_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  photo?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateTimelogFileRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  timelog_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  photo?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
