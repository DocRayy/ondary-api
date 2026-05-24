import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsIn,
} from 'class-validator';

export const TIMELOG_STATUSES = ['active', 'pause', 'finish'];

export class CreateTimelogRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_todo_id?: number;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  time?: string;

  @IsOptional()
  @IsString()
  @IsIn(TIMELOG_STATUSES)
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;

  @IsOptional()
  @IsString()
  start_note?: string;

  @IsOptional()
  @IsString()
  end_note?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minuted_logged?: number;
}

export class UpdateTimelogRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_todo_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  time?: string;

  @IsOptional()
  @IsString()
  @IsIn(TIMELOG_STATUSES)
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;

  @IsOptional()
  @IsString()
  start_note?: string;

  @IsOptional()
  @IsString()
  end_note?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minuted_logged?: number;
}
