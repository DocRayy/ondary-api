import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateManagerNoteRequest {
  @ValidateIf((payload: CreateManagerNoteRequest) => !payload.send_to_all)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  send_to_all?: boolean;

  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateManagerNoteRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
