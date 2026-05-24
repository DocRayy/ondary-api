import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateTaskBookmarkRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id: number;

  @IsString()
  @MaxLength(120)
  label: string;
}

export class UpdateTaskBookmarkRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;
}
