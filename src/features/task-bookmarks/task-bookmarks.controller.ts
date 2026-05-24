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
  CreateTaskBookmarkRequest,
  TaskBookmarkIdParam,
  UpdateTaskBookmarkRequest,
} from './dto';
import { TaskBookmarksService } from './task-bookmarks.service';

@Controller('task-bookmarks')
export class TaskBookmarksController {
  constructor(private readonly taskBookmarksService: TaskBookmarksService) {}

  @Post()
  create(@Body() payload: CreateTaskBookmarkRequest) {
    return this.taskBookmarksService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskBookmarksService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskBookmarkIdParam) {
    return this.taskBookmarksService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskBookmarkIdParam,
    @Body() payload: UpdateTaskBookmarkRequest,
  ) {
    return this.taskBookmarksService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskBookmarkIdParam) {
    return this.taskBookmarksService.remove(params.id);
  }
}
