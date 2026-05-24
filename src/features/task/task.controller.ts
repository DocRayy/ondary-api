import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import {
  CreateTaskRequest,
  MoveTaskRequest,
  TaskIdParam,
  UpdateTaskRequest,
} from './dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() payload: CreateTaskRequest,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.taskService.create(payload, user.id);
  }

  @Get()
  findAll(@Query('user_id') userId?: string) {
    return this.taskService.findAll(userId ? Number(userId) : undefined);
  }

  @Get('report/pdf')
  async pdf(
    @Res() res,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('type') type?: string,
  ) {
    return this.taskService.generateTaskReport(res, { month, year, type });
  }

  @Get(':id')
  findOne(@Param() params: TaskIdParam) {
    return this.taskService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: TaskIdParam, @Body() payload: UpdateTaskRequest) {
    return this.taskService.update(params.id, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/move')
  move(
    @Param() params: TaskIdParam,
    @Body() payload: MoveTaskRequest,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.taskService.move(params.id, payload, user.id);
  }

  @Delete(':id')
  remove(@Param() params: TaskIdParam) {
    return this.taskService.remove(params.id);
  }
}
