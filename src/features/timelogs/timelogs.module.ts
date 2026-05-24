import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TaskEntity,
  TaskTodoEntity,
  TimelogEntity,
} from '../../database/entities';
import { TimelogsController } from './timelogs.controller';
import { TimelogsService } from './timelogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimelogEntity, TaskTodoEntity, TaskEntity]),
  ],
  controllers: [TimelogsController],
  providers: [TimelogsService],
  exports: [TimelogsService],
})
export class TimelogsModule {}
