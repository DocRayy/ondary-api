import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class TaskUserIdParam {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
