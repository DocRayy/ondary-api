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
  CreateTaskFileRequest,
  TaskFileIdParam,
  UpdateTaskFileRequest,
} from './dto';
import { TaskFilesService } from './task-files.service';

@Controller('task-files')
export class TaskFilesController {
  constructor(private readonly taskFilesService: TaskFilesService) {}

  @Post()
  create(@Body() payload: CreateTaskFileRequest) {
    return this.taskFilesService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskFileIdParam) {
    return this.taskFilesService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskFileIdParam,
    @Body() payload: UpdateTaskFileRequest,
  ) {
    return this.taskFilesService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskFileIdParam) {
    return this.taskFilesService.remove(params.id);
  }
}
