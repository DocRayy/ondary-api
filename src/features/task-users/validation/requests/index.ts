import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateTaskUserRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id: number;
}

export class UpdateTaskUserRequest {
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
}
