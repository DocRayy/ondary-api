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
  CreateTaskLabelMapRequest,
  TaskLabelMapParams,
  UpdateTaskLabelMapRequest,
} from './dto';
import { TaskLabelMapsService } from './task-label-maps.service';

@Controller('task-label-maps')
export class TaskLabelMapsController {
  constructor(private readonly taskLabelMapsService: TaskLabelMapsService) {}

  @Post()
  create(@Body() payload: CreateTaskLabelMapRequest) {
    return this.taskLabelMapsService.create(payload);
  }

  @Get()
  findAll() {
    return this.taskLabelMapsService.findAll();
  }

  @Get(':task_id/:task_label_id')
  findOne(@Param() params: TaskLabelMapParams) {
    return this.taskLabelMapsService.findOne(params);
  }

  @Patch(':task_id/:task_label_id')
  update(
    @Param() params: TaskLabelMapParams,
    @Body() payload: UpdateTaskLabelMapRequest,
  ) {
    return this.taskLabelMapsService.update(params, payload);
  }

  @Delete(':task_id/:task_label_id')
  remove(@Param() params: TaskLabelMapParams) {
    return this.taskLabelMapsService.remove(params);
  }
}
