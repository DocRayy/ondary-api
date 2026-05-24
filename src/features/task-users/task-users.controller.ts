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
  CreateTaskUserRequest,
  TaskUserIdParam,
  UpdateTaskUserRequest,
} from './dto';
import { TaskUsersService } from './task-users.service';

@Controller('task-users')
export class TaskUsersController {
  constructor(private readonly taskUsersService: TaskUsersService) {}

  @Post()
  create(@Body() payload: CreateTaskUserRequest) {
    return this.taskUsersService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskUserIdParam) {
    return this.taskUsersService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskUserIdParam,
    @Body() payload: UpdateTaskUserRequest,
  ) {
    return this.taskUsersService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskUserIdParam) {
    return this.taskUsersService.remove(params.id);
  }
}
