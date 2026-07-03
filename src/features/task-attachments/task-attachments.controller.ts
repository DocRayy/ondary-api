import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  fileUploadOptions,
  UploadedFile,
} from '../../common/uploads/photo-upload.config';
import {
  CreateTaskAttachmentRequest,
  TaskAttachmentIdParam,
  UpdateTaskAttachmentRequest,
} from './dto';
import { TaskAttachmentsService } from './task-attachments.service';

@Controller('task-attachments')
export class TaskAttachmentsController {
  constructor(
    private readonly taskAttachmentsService: TaskAttachmentsService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, fileUploadOptions('task-attachments')),
  )
  create(
    @Body() payload: CreateTaskAttachmentRequest,
    @UploadedFiles() files: UploadedFile[] = [],
  ) {
    return this.taskAttachmentsService.create(payload, files);
  }

  @Get()
  findAll(@Query('task_id') taskId?: string) {
    return this.taskAttachmentsService.findAll(
      taskId ? Number(taskId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param() params: TaskAttachmentIdParam) {
    return this.taskAttachmentsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TaskAttachmentIdParam,
    @Body() payload: UpdateTaskAttachmentRequest,
  ) {
    return this.taskAttachmentsService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TaskAttachmentIdParam) {
    return this.taskAttachmentsService.remove(params.id);
  }
}
