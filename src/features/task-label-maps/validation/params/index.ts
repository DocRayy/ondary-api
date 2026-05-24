import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class TaskLabelMapParams {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_label_id: number;
}
