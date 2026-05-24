import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskFileEntity } from '../../database/entities';
import { TaskFilesController } from './task-files.controller';
import { TaskFilesService } from './task-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskFileEntity])],
  controllers: [TaskFilesController],
  providers: [TaskFilesService],
  exports: [TaskFilesService],
})
export class TaskFilesModule {}
