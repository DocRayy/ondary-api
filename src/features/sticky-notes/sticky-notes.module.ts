import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StickyNoteEntity } from '../../database/entities';
import { StickyNotesController } from './sticky-notes.controller';
import { StickyNotesService } from './sticky-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([StickyNoteEntity])],
  controllers: [StickyNotesController],
  providers: [StickyNotesService],
  exports: [StickyNotesService],
})
export class StickyNotesModule {}
