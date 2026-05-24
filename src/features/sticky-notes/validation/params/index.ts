import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class StickyNoteIdParam {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
