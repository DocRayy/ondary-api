import { Type } from 'class-transformer';
import {
  IsDateString,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTaskTodoRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @IsArray()
  user_ids?: number[];

  @IsString()
  @MaxLength(150)
  label: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  progress?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimate_time?: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsDateString()
  finish_date?: string;

  @IsOptional()
  @IsArray()
  files?: Record<string, unknown>[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  created_by?: number;
}

export class UpdateTaskTodoRequest {
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
  @IsArray()
  user_ids?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(150)
  label?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  progress?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimate_time?: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsDateString()
  finish_date?: string;

  @IsOptional()
  @IsArray()
  files?: Record<string, unknown>[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  created_by?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  updated_by?: number;
}
