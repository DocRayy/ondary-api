import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskBookmarkEntity } from '../../database/entities';
import { TaskBookmarksController } from './task-bookmarks.controller';
import { TaskBookmarksService } from './task-bookmarks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskBookmarkEntity])],
  controllers: [TaskBookmarksController],
  providers: [TaskBookmarksService],
  exports: [TaskBookmarksService],
})
export class TaskBookmarksModule {}
