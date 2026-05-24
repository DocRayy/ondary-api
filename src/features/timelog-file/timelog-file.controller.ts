import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { photoUploadOptions } from '../../common/uploads/photo-upload.config';
import type { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import {
  CreateTimelogFileRequest,
  TimelogFileIdParam,
  UpdateTimelogFileRequest,
} from './dto';
import { TimelogFileService } from './timelog-file.service';

@Controller('timelog-file')
export class TimelogFileController {
  constructor(private readonly timelogFileService: TimelogFileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions('timelog-file')))
  create(
    @Body() payload: CreateTimelogFileRequest,
    @UploadedFile() photo?: UploadedPhoto,
  ) {
    return this.timelogFileService.create(payload, photo);
  }

  @Get()
  findAll() {
    return this.timelogFileService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TimelogFileIdParam) {
    return this.timelogFileService.findOne(params.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions('timelog-file')))
  update(
    @Param() params: TimelogFileIdParam,
    @Body() payload: UpdateTimelogFileRequest,
    @UploadedFile() photo?: UploadedPhoto,
  ) {
    return this.timelogFileService.update(params.id, payload, photo);
  }

  @Delete(':id')
  remove(@Param() params: TimelogFileIdParam) {
    return this.timelogFileService.remove(params.id);
  }
}
