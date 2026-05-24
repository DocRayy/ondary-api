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
  CreateTaskLabelRequest,
  TaskLabelIdParam,
  UpdateTaskLabelRequest,
} from './dto';
import { TaskLabelsService } from './task-labels.service';

@Controller('task-labels')
export class TaskLabelsController {
  constructor(private readonly taskLabelsService: TaskLabelsService) {}

  @Post()
  create(@Body() payload: CreateTaskLabelRequest) {
    return this.taskLabelsService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskLabelsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskLabelIdParam) {
    return this.taskLabelsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskLabelIdParam,
    @Body() payload: UpdateTaskLabelRequest,
  ) {
    return this.taskLabelsService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskLabelIdParam) {
    return this.taskLabelsService.remove(params.id);
  }
}
