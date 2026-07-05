import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditLogContextService } from './audit-log-context.service';
import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly auditLogsService;
    private readonly auditLogContextService;
    constructor(auditLogsService: AuditLogsService, auditLogContextService: AuditLogContextService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
