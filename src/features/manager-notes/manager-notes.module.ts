import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerNoteEntity, UserEntity } from '../../database/entities';
import { ManagerNotesController } from './manager-notes.controller';
import { ManagerNotesService } from './manager-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerNoteEntity, UserEntity])],
  controllers: [ManagerNotesController],
  providers: [ManagerNotesService],
  exports: [ManagerNotesService],
})
export class ManagerNotesModule {}
