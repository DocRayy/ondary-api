import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAttachmentEntity, TaskEntity } from '../../database/entities';
import { TaskAttachmentsController } from './task-attachments.controller';
import { TaskAttachmentsService } from './task-attachments.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAttachmentEntity, TaskEntity])],
  controllers: [TaskAttachmentsController],
  providers: [TaskAttachmentsService],
  exports: [TaskAttachmentsService],
})
export class TaskAttachmentsModule {}
