import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateStickyNoteRequest,
  StickyNoteIdParam,
  UpdateStickyNoteRequest,
} from './dto';
import { StickyNotesService } from './sticky-notes.service';

@Controller('sticky-notes')
export class StickyNotesController {
  constructor(private readonly stickyNotesService: StickyNotesService) {}

  @Post()
  create(@Body() payload: CreateStickyNoteRequest) {
    return this.stickyNotesService.create(payload);
  }

  @Get()
  findAll() {
    return this.stickyNotesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: StickyNoteIdParam) {
    return this.stickyNotesService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: StickyNoteIdParam,
    @Body() payload: UpdateStickyNoteRequest,
  ) {
    return this.stickyNotesService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: StickyNoteIdParam) {
    return this.stickyNotesService.remove(params.id);
  }
}
