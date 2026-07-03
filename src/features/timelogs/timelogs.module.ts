import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TaskEntity,
  TaskTodoEntity,
  TimelogEntity,
} from '../../database/entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { TimelogsController } from './timelogs.controller';
import { TimelogsService } from './timelogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimelogEntity, TaskTodoEntity, TaskEntity]),
    RealtimeModule,
  ],
  controllers: [TimelogsController],
  providers: [TimelogsService],
  exports: [TimelogsService],
})
export class TimelogsModule {}
