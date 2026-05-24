import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskLabelRequest {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsString()
  @MaxLength(30)
  color: string;
}

export class UpdateTaskLabelRequest {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;
}
