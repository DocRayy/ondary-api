import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateTimelogRequest,
  TimelogIdParam,
  UpdateTimelogRequest,
} from './dto';
import { TimelogsService } from './timelogs.service';

@Controller('timelogs')
export class TimelogsController {
  constructor(private readonly timelogsService: TimelogsService) {}

  @Post()
  create(@Body() payload: CreateTimelogRequest) {
    return this.timelogsService.create(payload);
  }

  @Get()
  findAll() {
    return this.timelogsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TimelogIdParam) {
    return this.timelogsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: TimelogIdParam,
    @Body() payload: UpdateTimelogRequest,
  ) {
    return this.timelogsService.update(params.id, payload);
  }

  @Delete(':id')
  remove(@Param() params: TimelogIdParam) {
    return this.timelogsService.remove(params.id);
  }
}
