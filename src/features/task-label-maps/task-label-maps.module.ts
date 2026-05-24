import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLabelMapEntity } from '../../database/entities';
import { TaskLabelMapsController } from './task-label-maps.controller';
import { TaskLabelMapsService } from './task-label-maps.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLabelMapEntity])],
  controllers: [TaskLabelMapsController],
  providers: [TaskLabelMapsService],
  exports: [TaskLabelMapsService],
})
export class TaskLabelMapsModule {}
