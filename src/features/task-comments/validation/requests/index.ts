import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindTaskCommentsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id?: number;
}

export class CreateTaskCommentRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @IsString()
  message: string;
}

export class UpdateTaskCommentRequest {
  @IsOptional()
  @IsString()
  message?: string;
}
