import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TaskCommentEntity,
  TaskEntity,
  UserEntity,
} from '../../database/entities';
import { NotificationModule } from '../notification/public/notifcation.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TaskCommentsController } from './task-comments.controller';
import { TaskCommentsService } from './task-comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskCommentEntity, TaskEntity, UserEntity]),
    NotificationModule,
    RealtimeModule,
  ],
  controllers: [TaskCommentsController],
  providers: [TaskCommentsService],
  exports: [TaskCommentsService],
})
export class TaskCommentsModule {}
