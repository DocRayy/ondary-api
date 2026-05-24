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
  CreateTaskTodoFileRequest,
  TaskTodoFileIdParam,
  UpdateTaskTodoFileRequest,
} from './dto';
import { TaskTodoFilesService } from './task-todo-files.service';

@Controller('task-todo-files')
export class TaskTodoFilesController {
  constructor(private readonly taskTodoFilesService: TaskTodoFilesService) {}

  @Post()
  create(@Body() payload: CreateTaskTodoFileRequest) {
    return this.taskTodoFilesService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskTodoFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskTodoFileIdParam) {
    return this.taskTodoFilesService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskTodoFileIdParam,
    @Body() payload: UpdateTaskTodoFileRequest,
  ) {
    return this.taskTodoFilesService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskTodoFileIdParam) {
    return this.taskTodoFilesService.remove(params.id);
  }
}
