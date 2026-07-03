import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseBackupsService } from './database-backups.service';
import { FindDatabaseBackupsQuery, RestoreDatabaseBackupRequest } from './dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(['database-backups', 'backups'])
export class DatabaseBackupsController {
  constructor(
    private readonly databaseBackupsService: DatabaseBackupsService,
  ) {}

  @Get()
  findAll(@Query() query: FindDatabaseBackupsQuery) {
    return this.databaseBackupsService.findAll(query);
  }

  @Post()
  create() {
    return this.databaseBackupsService.create();
  }

  @Post('restore')
  restore(@Body() payload: RestoreDatabaseBackupRequest) {
    return this.databaseBackupsService.restore(payload.filename);
  }

  @Post(':id/restore')
  restoreById(@Param('id') id: string) {
    return this.databaseBackupsService.restore(id);
  }

  @Get(':id/download')
  async download(
    @Param('id') filename: string,
    @Res() response: Response,
  ) {
    const download =
      await this.databaseBackupsService.getDownloadPath(filename);
    return response.download(download.filePath, download.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databaseBackupsService.remove(id);
  }
}
