import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity, TaskTodoEntity } from '../../database/entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { NotificationModule } from '../notification/public/notifcation.module';
import { TaskTodosController } from './task-todos.controller';
import { TaskTodosService } from './task-todos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskTodoEntity, TaskEntity]),
    RealtimeModule,
    NotificationModule,
  ],
  controllers: [TaskTodosController],
  providers: [TaskTodosService],
  exports: [TaskTodosService],
})
export class TaskTodosModule {}
