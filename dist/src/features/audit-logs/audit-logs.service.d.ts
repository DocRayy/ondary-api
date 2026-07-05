import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { AuditLogEntity } from '../../database/entities';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { RealtimeService } from '../realtime/realtime.service';
import { AuditLogContextService } from './audit-log-context.service';
import { FindAuditLogsQuery } from './dto';
type RequestWithUser = Request & {
    user?: Partial<AuthenticatedUser>;
    route?: {
        path?: string;
    };
};
type PayloadChanges = Record<string, {
    before: unknown;
    after: unknown;
}>;
export declare class AuditLogsService {
    private readonly auditLogsRepository;
    private readonly jwtService;
    private readonly realtimeService;
    private readonly auditLogContextService;
    private readonly dataSource;
    private readonly backupDir;
    constructor(auditLogsRepository: Repository<AuditLogEntity>, jwtService: JwtService, realtimeService: RealtimeService, auditLogContextService: AuditLogContextService, dataSource: DataSource);
    findAll(query: FindAuditLogsQuery): Promise<{
        title: string;
        message: string;
        data: {
            items: {
                id: number;
                user_id: number | null;
                username: string | null;
                user_role: string | null;
                action: string;
                module: string;
                table_name: string | null;
                method: string;
                path: string;
                endpoint: string;
                target_url: string;
                route: string | null;
                resource_id: string | null;
                status_code: number | null;
                duration_ms: number | null;
                ip_address: string | null;
                user_agent: string | null;
                query_params: Record<string, unknown> | null;
                request_body: Record<string, unknown> | null;
                old_values: Record<string, unknown> | null;
                new_values: Record<string, unknown> | null;
                changed_fields: string[] | null;
                old_payload: Record<string, unknown> | null;
                new_payload: Record<string, unknown> | null;
                payload_changes: Record<string, unknown>[] | PayloadChanges | null;
                database_changes: Record<string, unknown>[] | null;
                metadata: Record<string, unknown> | null;
                created_at: Date;
            }[];
            meta: {
                total: number;
                page: number;
                limit: number;
                page_count: number;
                limit_options: number[];
            };
        } | undefined;
    }>;
    meta(): {
        title: string;
        message: string;
        data: {
            fields: readonly ["id", "user_id", "username", "user_role", "action", "module", "table_name", "method", "path", "endpoint", "target_url", "route", "resource_id", "status_code", "duration_ms", "ip_address", "user_agent", "query_params", "request_body", "old_values", "new_values", "changed_fields", "old_payload", "new_payload", "payload_changes", "database_changes", "metadata", "created_at"];
            actions: readonly ["create", "update", "delete", "restore", "generate_pdf"];
            modules: readonly ["auth", "users", "projects", "task", "task-attachments", "task-bookmarks", "task-comments", "task-files", "task-labels", "task-label-maps", "task-todos", "task-todo-files", "task-users", "timelogs", "timelog-file", "sticky-notes", "manager-notes", "notifications", "database-backups", "reports", "audit-logs"];
            limit_options: number[];
            default_limit: number;
            socket_event: string;
        } | undefined;
    };
    captureRequestSnapshot(request: RequestWithUser): Promise<void>;
    private resolveDateRange;
    recordRequest(request: RequestWithUser, statusCode: number, durationMs: number, error?: unknown): Promise<void>;
    private resolvePrimaryChange;
    private resolveOldValues;
    private resolveCompleteNewValues;
    private resolveUser;
    private resolveAction;
    private resolveModule;
    private isVisibleAction;
    private resolveFallbackNewValues;
    private resolveFallbackChangedFields;
    private resolveChangedFields;
    private nonEmptyFields;
    private resolveAuditPayload;
    private pickFields;
    private toPayloadChanges;
    private resolveAuthEvent;
    private resolveLoginIdentifier;
    private resolveMetadata;
    private resolveSnapshotEntity;
    private findEntitySnapshot;
    private parsePrimaryKeyValue;
    private resolveBackupRequestSnapshot;
    private resolveBackupPath;
    private resolveBackupFilename;
    private createBackupId;
    private serializeLog;
    private resolvePayloadChangesFromLog;
    private resolveResourceId;
    private resolveIp;
    private sanitizeObject;
    private redact;
    private truncateObject;
    private keysOf;
    private truncate;
}
export {};
