import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLabelEntity } from '../../database/entities';
import { TaskLabelsController } from './task-labels.controller';
import { TaskLabelsService } from './task-labels.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLabelEntity])],
  controllers: [TaskLabelsController],
  providers: [TaskLabelsService],
  exports: [TaskLabelsService],
})
export class TaskLabelsModule {}
