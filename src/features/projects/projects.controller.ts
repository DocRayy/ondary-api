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
  CreateProjectRequest,
  ProjectIdParam,
  UpdateProjectRequest,
} from './dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions('projects')))
  create(
    @Body() payload: CreateProjectRequest,
    @UploadedFile() photo?: UploadedPhoto,
  ) {
    return this.projectsService.create(payload, photo);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: ProjectIdParam) {
    return this.projectsService.findOne(params.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions('projects')))
  update(
    @Param() params: ProjectIdParam,
    @Body() payload: UpdateProjectRequest,
    @UploadedFile() photo?: UploadedPhoto,
  ) {
    return this.projectsService.update(params.id, payload, photo);
  }

  @Delete(':id')
  remove(@Param() params: ProjectIdParam) {
    return this.projectsService.remove(params.id);
  }
}
