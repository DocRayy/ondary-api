import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TaskEntity,
  TaskTodoEntity,
  TimelogEntity,
  UserEntity,
  ProjectEntity,
} from '../../database/entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskTodoEntity,
      TimelogEntity,
      UserEntity,
      ProjectEntity,
    ]),
    RealtimeModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
