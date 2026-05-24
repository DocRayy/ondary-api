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
import { CreateUserRequest, UpdateUserRequest, UserIdParam } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions('users')))
  create(
    @Body() payload: CreateUserRequest,
    @UploadedFile() photo?: UploadedPhoto,
  ) {
    return this.usersService.create(payload, photo);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UserIdParam) {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', photoUploadOptions('users')))
  update(
    @Param() params: UserIdParam,
    @Body() payload: UpdateUserRequest,
    @UploadedFile() photo?: UploadedPhoto,
  ) {
    return this.usersService.update(params.id, payload, photo);
  }

  @Delete(':id')
  remove(@Param() params: UserIdParam) {
    return this.usersService.remove(params.id);
  }
}
