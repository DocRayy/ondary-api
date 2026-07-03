import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindAuditLogsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @IsDateString()
  from_date?: string;

  @IsOptional()
  @IsDateString()
  to_date?: string;

  @IsOptional()
  @IsIn(['7d', '30d', '90d', 'all'])
  date_range?: '7d' | '30d' | '90d' | 'all';

  @IsOptional()
  @IsString()
  search?: string;
}
