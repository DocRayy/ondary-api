import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from '../../database/entities';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { AuditLogContextService } from './audit-log-context.service';
import { AuditLogSubscriber } from './audit-log.subscriber';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLogEntity]),
    AuthModule,
    RealtimeModule,
  ],
  controllers: [AuditLogsController],
  providers: [
    AuditLogsService,
    AuditLogContextService,
    AuditLogSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AuditLogsModule {}
