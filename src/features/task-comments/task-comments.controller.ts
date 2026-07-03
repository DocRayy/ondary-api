import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import {
  CreateTaskCommentRequest,
  FindTaskCommentsQuery,
  TaskCommentIdParam,
  UpdateTaskCommentRequest,
} from './dto';
import { TaskCommentsService } from './task-comments.service';

@Controller('task-comments')
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @Get()
  findAll(@Query() query: FindTaskCommentsQuery) {
    return this.taskCommentsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() payload: CreateTaskCommentRequest,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.taskCommentsService.create(payload, user.id);
  }

  @Get(':id')
  findOne(@Param() params: TaskCommentIdParam) {
    return this.taskCommentsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskCommentIdParam,
    @Body() payload: UpdateTaskCommentRequest,
  ) {
    return this.taskCommentsService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskCommentIdParam) {
    return this.taskCommentsService.remove(params.id);
  }
}
