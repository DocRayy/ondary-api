import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseBackupsController } from './database-backups.controller';
import { DatabaseBackupsService } from './database-backups.service';

@Module({
  imports: [AuthModule],
  controllers: [DatabaseBackupsController],
  providers: [DatabaseBackupsService],
})
export class DatabaseBackupsModule {}
