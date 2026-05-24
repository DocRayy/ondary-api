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
  CreateTaskTodoRequest,
  TaskTodoIdParam,
  UpdateTaskTodoRequest,
} from './dto';
import { TaskTodosService } from './task-todos.service';

@Controller('task-todos')
export class TaskTodosController {
  constructor(private readonly taskTodosService: TaskTodosService) {}

  @Post()
  create(@Body() payload: CreateTaskTodoRequest) {
    return this.taskTodosService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskTodosService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskTodoIdParam) {
    return this.taskTodosService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskTodoIdParam,
    @Body() payload: UpdateTaskTodoRequest,
  ) {
    return this.taskTodosService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskTodoIdParam) {
    return this.taskTodosService.remove(params.id);
  }
}
