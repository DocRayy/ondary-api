import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateTaskLabelMapRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_label_id: number;
}

export class UpdateTaskLabelMapRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_label_id?: number;
}
