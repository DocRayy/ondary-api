import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, catchError, from, mergeMap, tap, throwError } from 'rxjs';
import { AuditLogContextService } from './audit-log-context.service';
import { AuditLogsService } from './audit-logs.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly auditLogContextService: AuditLogContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context
      .switchToHttp()
      .getRequest<
        Request & { user?: Record<string, unknown>; route?: { path?: string } }
      >();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    return this.auditLogContextService.run(() =>
      from(this.auditLogsService.captureRequestSnapshot(request)).pipe(
        mergeMap(() =>
          next.handle().pipe(
            tap(() => {
              void this.auditLogsService.recordRequest(
                request,
                response.statusCode,
                Date.now() - startedAt,
              );
            }),
            catchError((error: unknown) => {
              const statusCode =
                typeof error === 'object' && error && 'status' in error
                  ? Number((error as { status?: number }).status)
                  : response.statusCode || 500;

              void this.auditLogsService.recordRequest(
                request,
                statusCode,
                Date.now() - startedAt,
                error,
              );

              return throwError(() => error);
            }),
          ),
        ),
      ),
    );
  }
}
