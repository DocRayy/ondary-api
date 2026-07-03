import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditLogsService } from './audit-logs.service';
import { FindAuditLogsQuery } from './dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll(@Query() query: FindAuditLogsQuery) {
    return this.auditLogsService.findAll(query);
  }

  @Get('meta')
  meta() {
    return this.auditLogsService.meta();
  }
}
