import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateNotificationRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  task_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
