import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTodoFileEntity } from '../../database/entities';
import { TaskTodoFilesController } from './task-todo-files.controller';
import { TaskTodoFilesService } from './task-todo-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTodoFileEntity])],
  controllers: [TaskTodoFilesController],
  providers: [TaskTodoFilesService],
  exports: [TaskTodoFilesService],
})
export class TaskTodoFilesModule {}
