import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelogFileEntity } from '../../database/entities';
import { TimelogFileController } from './timelog-file.controller';
import { TimelogFileService } from './timelog-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimelogFileEntity])],
  controllers: [TimelogFileController],
  providers: [TimelogFileService],
  exports: [TimelogFileService],
})
export class TimelogFileModule {}
