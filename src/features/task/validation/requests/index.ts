import { Type } from 'class-transformer';
import {
  IsDateString,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export const TASK_STATUSES = ['draft', 'progress', 'on_hold', 'completed'];

export class CreateTaskRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  project_id: number;

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
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimate_time?: number;

  @IsOptional()
  @IsDateString()
  finish_date?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order_index?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  progress?: number;

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  @MaxLength(30)
  board_column?: string;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  assignee_user_ids?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  label_ids?: number[];

  @IsOptional()
  @IsArray()
  bookmarks?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  files?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  movement_history?: Record<string, unknown>[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  created_by?: number;
}

export class UpdateTaskRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  project_id?: number;

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
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimate_time?: number;

  @IsOptional()
  @IsDateString()
  finish_date?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order_index?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  progress?: number;

  @IsOptional()
  @IsDateString()
  moved_at?: string;

  @IsOptional()
  @IsDateString()
  completed_at?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  updated_by?: number;

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  @MaxLength(30)
  board_column?: string;

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  assignee_user_ids?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  label_ids?: number[];

  @IsOptional()
  @IsArray()
  bookmarks?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  files?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  movement_history?: Record<string, unknown>[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  created_by?: number;
}

export class MoveTaskRequest {
  @IsString()
  @IsIn(TASK_STATUSES)
  status: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order_index: number;
}
