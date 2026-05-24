import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ManagerGuard } from '../auth/guards/manager.guard';
import {
  CreateManagerNoteRequest,
  ManagerNoteIdParam,
  UpdateManagerNoteRequest,
} from './dto';
import { ManagerNotesService } from './manager-notes.service';

@Controller('manager-notes')
export class ManagerNotesController {
  constructor(private readonly managerNotesService: ManagerNotesService) {}

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Post()
  create(@Body() payload: CreateManagerNoteRequest) {
    return this.managerNotesService.create(payload);
  }

  @Get()
  findAll() {
    return this.managerNotesService.findAll();
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Get('recipients')
  findRecipients() {
    return this.managerNotesService.findRecipients();
  }

  @Get(':id')
  findOne(@Param() params: ManagerNoteIdParam) {
    return this.managerNotesService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: ManagerNoteIdParam,
    @Body() payload: UpdateManagerNoteRequest,
  ) {
    return this.managerNotesService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: ManagerNoteIdParam) {
    return this.managerNotesService.remove(params.id);
  }
}
