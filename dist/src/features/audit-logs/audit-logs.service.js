"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
const realtime_service_1 = require("../realtime/realtime.service");
const audit_log_context_service_1 = require("./audit-log-context.service");
const audit_log_constants_1 = require("./audit-log.constants");
const VISIBLE_ACTIVITY_ACTIONS = [
    'create',
    'update',
    'delete',
    'restore',
    'generate_pdf',
];
const VALID_AUDIT_LOG_MODULES = audit_log_constants_1.AUDIT_LOG_MODULES;
let AuditLogsService = class AuditLogsService {
    auditLogsRepository;
    jwtService;
    realtimeService;
    auditLogContextService;
    dataSource;
    backupDir = (0, path_1.resolve)(process.cwd(), 'storage', 'backups');
    constructor(auditLogsRepository, jwtService, realtimeService, auditLogContextService, dataSource) {
        this.auditLogsRepository = auditLogsRepository;
        this.jwtService = jwtService;
        this.realtimeService = realtimeService;
        this.auditLogContextService = auditLogContextService;
        this.dataSource = dataSource;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = [];
        const baseWhere = {};
        if (query.action) {
            baseWhere.action = VISIBLE_ACTIVITY_ACTIONS.includes(query.action)
                ? query.action
                : (0, typeorm_2.In)([]);
        }
        else {
            baseWhere.action = (0, typeorm_2.In)([...VISIBLE_ACTIVITY_ACTIONS]);
        }
        if (query.module) {
            baseWhere.module = VALID_AUDIT_LOG_MODULES.includes(query.module)
                ? query.module
                : (0, typeorm_2.In)([]);
        }
        if (query.user_id) {
            baseWhere.user_id = query.user_id;
        }
        const dateRange = this.resolveDateRange(query);
        if (dateRange.from && dateRange.to) {
            baseWhere.created_at = (0, typeorm_2.Between)(dateRange.from, dateRange.to);
        }
        else if (dateRange.from) {
            baseWhere.created_at = (0, typeorm_2.MoreThanOrEqual)(dateRange.from);
        }
        if (query.search) {
            where.push({ ...baseWhere, username: (0, typeorm_2.Like)(`%${query.search}%`) }, { ...baseWhere, path: (0, typeorm_2.Like)(`%${query.search}%`) }, { ...baseWhere, module: (0, typeorm_2.Like)(`%${query.search}%`) });
        }
        const [items, total] = await this.auditLogsRepository.findAndCount({
            where: where.length > 0 ? where : baseWhere,
            relations: { user: true },
            order: { created_at: 'DESC', id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return (0, api_response_util_1.successResponse)('Audit Logs Retrieved', 'Audit logs retrieved successfully', {
            items: (0, remove_passwords_util_1.removePasswords)(items.map((item) => this.serializeLog(item))),
            meta: {
                total,
                page,
                limit,
                page_count: Math.ceil(total / limit),
                limit_options: [10, 25, 50, 100],
            },
        });
    }
    meta() {
        return (0, api_response_util_1.successResponse)('Audit Log Metadata Retrieved', 'Audit log metadata retrieved successfully', {
            fields: audit_log_constants_1.AUDIT_LOG_FIELDS,
            actions: audit_log_constants_1.AUDIT_LOG_ACTIONS,
            modules: audit_log_constants_1.AUDIT_LOG_MODULES,
            limit_options: [10, 25, 50, 100],
            default_limit: 10,
            socket_event: 'audit-log.created',
        });
    }
    async captureRequestSnapshot(request) {
        const action = this.resolveAction(request.method, request.path);
        if (action !== 'update' && action !== 'delete' && action !== 'restore') {
            this.auditLogContextService.setRequestSnapshot(null);
            return;
        }
        const resourceId = this.resolveResourceId(request);
        const backupSnapshot = await this.resolveBackupRequestSnapshot(request, action, resourceId);
        if (backupSnapshot) {
            this.auditLogContextService.setRequestSnapshot(backupSnapshot);
            return;
        }
        const entity = this.resolveSnapshotEntity(request.path);
        if (!resourceId || !entity) {
            this.auditLogContextService.setRequestSnapshot(null);
            return;
        }
        try {
            const repository = this.dataSource.getRepository(entity);
            const oldValues = this.sanitizeObject(await this.findEntitySnapshot(repository, resourceId));
            if (!oldValues) {
                this.auditLogContextService.setRequestSnapshot(null);
                return;
            }
            this.auditLogContextService.setRequestSnapshot({
                table_name: repository.metadata.tableName,
                action,
                resource_id: resourceId,
                old_values: oldValues,
                new_values: null,
                changed_fields: this.resolveFallbackChangedFields(this.sanitizeObject(request.body)) ??
                    [],
            });
        }
        catch {
            this.auditLogContextService.setRequestSnapshot(null);
        }
    }
    resolveDateRange(query) {
        if (query.from_date || query.to_date) {
            return {
                from: query.from_date ? new Date(query.from_date) : null,
                to: query.to_date ? new Date(query.to_date) : null,
            };
        }
        if (!query.date_range || query.date_range === 'all') {
            return { from: null, to: null };
        }
        const daysByRange = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
        };
        const to = new Date();
        const from = new Date(to);
        from.setDate(from.getDate() - daysByRange[query.date_range]);
        return { from, to };
    }
    async recordRequest(request, statusCode, durationMs, error) {
        const user = await this.resolveUser(request);
        const path = request.originalUrl ?? request.url;
        const moduleName = this.resolveModule(request.path);
        const action = this.resolveAction(request.method, request.path);
        if (!this.isVisibleAction(action) ||
            !VALID_AUDIT_LOG_MODULES.includes(moduleName)) {
            return;
        }
        const databaseChanges = this.auditLogContextService.getDatabaseChanges();
        const requestSnapshot = this.auditLogContextService.getRequestSnapshot();
        const primaryChange = this.resolvePrimaryChange(databaseChanges, action, requestSnapshot);
        const requestBody = this.sanitizeObject(request.body);
        const authEvent = await this.resolveAuthEvent(request, statusCode);
        const fallbackNewValues = this.resolveFallbackNewValues(action, request, path, requestSnapshot?.old_values ?? null, requestBody);
        const oldValues = this.resolveOldValues(action, requestSnapshot?.old_values ?? null, primaryChange?.old_values ?? null);
        const newValues = this.resolveCompleteNewValues(action, oldValues, primaryChange?.new_values ?? null, fallbackNewValues);
        const changedFields = this.resolveChangedFields(oldValues, newValues) ??
            this.nonEmptyFields(primaryChange?.changed_fields) ??
            requestSnapshot?.changed_fields ??
            this.resolveFallbackChangedFields(newValues);
        const auditPayload = this.resolveAuditPayload(action, oldValues, newValues, changedFields);
        const metadata = this.resolveMetadata(error, authEvent, auditPayload);
        const auditLog = await this.auditLogsRepository.save(this.auditLogsRepository.create({
            user_id: user?.id ?? authEvent?.user_id ?? null,
            username: user?.username ?? authEvent?.username ?? null,
            user_role: user?.role ?? authEvent?.user_role ?? null,
            action,
            module: moduleName,
            table_name: requestSnapshot?.table_name ?? primaryChange?.table_name ?? null,
            method: request.method,
            path,
            route: request.route?.path ? String(request.route.path) : null,
            resource_id: this.resolveResourceId(request),
            status_code: statusCode,
            duration_ms: durationMs,
            ip_address: this.resolveIp(request),
            user_agent: this.truncate(String(request.headers['user-agent'] ?? ''), 255),
            query_params: this.sanitizeObject(request.query),
            request_body: requestBody,
            old_values: auditPayload.old_values,
            new_values: auditPayload.new_values,
            changed_fields: auditPayload.changed_fields,
            database_changes: databaseChanges.length > 0 ? databaseChanges : null,
            metadata,
        }));
        this.realtimeService.emitAuditLog(auditLog);
    }
    resolvePrimaryChange(databaseChanges, action, requestSnapshot) {
        if (databaseChanges.length === 0) {
            return null;
        }
        if (requestSnapshot) {
            const endpointChange = databaseChanges.find((change) => change.action === action &&
                change.table_name === requestSnapshot.table_name &&
                change.resource_id === requestSnapshot.resource_id);
            if (endpointChange) {
                return endpointChange;
            }
            return null;
        }
        return (databaseChanges.find((change) => change.action === action) ??
            databaseChanges[0]);
    }
    resolveOldValues(action, requestOldValues, primaryOldValues) {
        if (action === 'update' || action === 'delete' || action === 'restore') {
            return requestOldValues ?? primaryOldValues;
        }
        return primaryOldValues ?? requestOldValues;
    }
    resolveCompleteNewValues(action, oldValues, primaryNewValues, fallbackNewValues) {
        if (action === 'delete') {
            return null;
        }
        if (action === 'update' && oldValues) {
            return {
                ...oldValues,
                ...(fallbackNewValues ?? {}),
                ...(primaryNewValues ?? {}),
            };
        }
        return primaryNewValues ?? fallbackNewValues;
    }
    async resolveUser(request) {
        if (request.user) {
            return request.user;
        }
        const authorization = request.headers.authorization;
        if (!authorization) {
            return null;
        }
        try {
            const payload = await this.jwtService.verifyAsync(authorization.replace(/^Bearer\s+/i, ''));
            return {
                id: payload.sub,
                username: payload.username,
                email: '',
                name: payload.username,
                role: '',
                status: 'active',
            };
        }
        catch {
            return null;
        }
    }
    resolveAction(method, path) {
        if (method === 'POST' &&
            (path === '/auth/login' || path === '/auth/logout')) {
            return 'create';
        }
        if (method === 'GET' && path === '/task/report/pdf') {
            return 'generate_pdf';
        }
        if (method === 'POST' &&
            (/^\/(?:database-backups|backups)\/[^/]+\/restore$/.test(path) ||
                /^\/(?:database-backups|backups)\/restore$/.test(path))) {
            return 'restore';
        }
        const actionByMethod = {
            POST: 'create',
            PATCH: 'update',
            PUT: 'update',
            DELETE: 'delete',
        };
        return actionByMethod[method] ?? 'unknown';
    }
    resolveModule(path) {
        if (path === '/task/report/pdf') {
            return 'reports';
        }
        const [moduleName] = path.split('/').filter(Boolean);
        if (moduleName === 'backups') {
            return 'database-backups';
        }
        return moduleName || 'root';
    }
    isVisibleAction(action) {
        return VISIBLE_ACTIVITY_ACTIONS.includes(action);
    }
    resolveFallbackNewValues(action, request, targetUrl, oldValues, requestBody) {
        if (!this.isVisibleAction(action)) {
            return null;
        }
        if (action === 'update' && oldValues && requestBody) {
            return {
                ...oldValues,
                ...requestBody,
            };
        }
        if (action === 'create') {
            return requestBody;
        }
        if (action === 'delete') {
            return null;
        }
        if (action === 'restore') {
            return this.sanitizeObject({
                restored_at: new Date().toISOString(),
                endpoint: targetUrl,
                target_url: targetUrl,
                query: request.query,
                backup_id: this.resolveResourceId(request),
            });
        }
        const payload = this.sanitizeObject({
            endpoint: targetUrl,
            target_url: targetUrl,
            query: request.query,
        });
        if (payload) {
            return payload;
        }
        return {
            endpoint: targetUrl,
            target_url: targetUrl,
        };
    }
    resolveFallbackChangedFields(newValues) {
        if (!newValues) {
            return null;
        }
        return Object.keys(newValues);
    }
    resolveChangedFields(oldValues, newValues) {
        if (!oldValues || !newValues) {
            return null;
        }
        const changedFields = Object.keys(newValues).filter((key) => JSON.stringify(oldValues[key] ?? null) !==
            JSON.stringify(newValues[key] ?? null));
        return this.nonEmptyFields(changedFields);
    }
    nonEmptyFields(fields) {
        return fields && fields.length > 0 ? fields : null;
    }
    resolveAuditPayload(action, oldValues, newValues, changedFields) {
        if (action === 'update') {
            return {
                old_values: oldValues,
                new_values: newValues,
                changed_fields: this.nonEmptyFields(changedFields),
                payload_changes: this.toPayloadChanges(oldValues, newValues),
            };
        }
        if (action === 'create') {
            const fields = this.keysOf(newValues);
            return {
                old_values: null,
                new_values: newValues,
                changed_fields: this.nonEmptyFields(fields),
                payload_changes: this.toPayloadChanges(null, newValues),
            };
        }
        if (action === 'delete') {
            return {
                old_values: oldValues,
                new_values: null,
                changed_fields: this.nonEmptyFields(this.keysOf(oldValues)),
                payload_changes: {
                    deleted_record: {
                        before: oldValues,
                        after: null,
                    },
                },
            };
        }
        if (action === 'restore') {
            return {
                old_values: oldValues,
                new_values: newValues,
                changed_fields: this.nonEmptyFields(this.keysOf(newValues)),
                payload_changes: this.toPayloadChanges(oldValues, newValues),
            };
        }
        return {
            old_values: oldValues,
            new_values: newValues,
            changed_fields: changedFields,
            payload_changes: this.toPayloadChanges(oldValues, newValues),
        };
    }
    pickFields(value, fields) {
        if (!value || fields.length === 0) {
            return null;
        }
        return fields.reduce((result, field) => {
            result[field] = value[field] ?? null;
            return result;
        }, {});
    }
    toPayloadChanges(oldValues, newValues) {
        const fields = new Set([
            ...this.keysOf(oldValues),
            ...this.keysOf(newValues),
        ]);
        if (fields.size === 0) {
            return null;
        }
        return [...fields].reduce((result, field) => {
            result[field] = {
                before: oldValues?.[field] ?? null,
                after: newValues?.[field] ?? null,
            };
            return result;
        }, {});
    }
    async resolveAuthEvent(request, statusCode) {
        const contextEvent = this.auditLogContextService.getAuthEvent();
        if (contextEvent) {
            return contextEvent;
        }
        if (request.method === 'POST' && request.path === '/auth/logout') {
            return {
                event: 'logout',
                user_id: request.user?.id ?? null,
                username: request.user?.username ?? null,
                user_role: request.user?.role ?? null,
            };
        }
        if (request.method !== 'POST' ||
            request.path !== '/auth/login' ||
            statusCode >= 400) {
            return null;
        }
        const identifier = this.resolveLoginIdentifier(request.body);
        if (!identifier) {
            return { event: 'login' };
        }
        const user = await this.dataSource.getRepository(entities_1.UserEntity).findOne({
            where: [{ username: identifier }, { email: identifier }],
        });
        return {
            event: 'login',
            username: user?.username ?? identifier,
            email: user?.email ?? identifier,
            user_id: user?.id ?? null,
            user_role: user?.role ?? null,
        };
    }
    resolveLoginIdentifier(body) {
        if (!body || typeof body !== 'object') {
            return null;
        }
        const payload = body;
        const identifier = payload.identifier ?? payload.username ?? payload.email;
        return typeof identifier === 'string' ? identifier : null;
    }
    resolveMetadata(error, authEvent, auditPayload) {
        const metadata = {};
        if (authEvent) {
            Object.assign(metadata, authEvent);
        }
        if (auditPayload.payload_changes) {
            metadata.payload_changes = auditPayload.payload_changes;
        }
        if (error) {
            metadata.error =
                error instanceof Error
                    ? this.truncate(error.message, 255)
                    : 'Request failed';
        }
        return Object.keys(metadata).length > 0 ? metadata : null;
    }
    resolveSnapshotEntity(path) {
        const [moduleName] = path.split('/').filter(Boolean);
        const entitiesByModule = {
            users: entities_1.UserEntity,
            projects: entities_1.ProjectEntity,
            task: entities_1.TaskEntity,
            'task-attachments': entities_1.TaskAttachmentEntity,
            'task-bookmarks': entities_1.TaskBookmarkEntity,
            'task-comments': entities_1.TaskCommentEntity,
            'task-files': entities_1.TaskFileEntity,
            'task-labels': entities_1.TaskLabelEntity,
            'task-label-maps': entities_1.TaskLabelMapEntity,
            'task-todos': entities_1.TaskTodoEntity,
            'task-todo-files': entities_1.TaskTodoFileEntity,
            'task-users': entities_1.TaskUserEntity,
            timelogs: entities_1.TimelogEntity,
            'timelog-file': entities_1.TimelogFileEntity,
            'sticky-notes': entities_1.StickyNoteEntity,
            'manager-notes': entities_1.ManagerNoteEntity,
            notifications: entities_1.NotificationEntity,
        };
        return moduleName ? (entitiesByModule[moduleName] ?? null) : null;
    }
    async findEntitySnapshot(repository, resourceId) {
        const primaryColumn = repository.metadata.primaryColumns[0];
        if (!primaryColumn) {
            return null;
        }
        const parsedResourceId = this.parsePrimaryKeyValue(resourceId);
        const query = repository
            .createQueryBuilder('entity')
            .where(`entity.${primaryColumn.propertyPath} = :resourceId`, {
            resourceId: parsedResourceId,
        });
        if (repository.metadata.deleteDateColumn) {
            query.withDeleted();
        }
        return query.getOne();
    }
    parsePrimaryKeyValue(value) {
        return /^\d+$/.test(value) ? Number(value) : value;
    }
    async resolveBackupRequestSnapshot(request, action, resourceId) {
        const [moduleName] = request.path.split('/').filter(Boolean);
        if ((action !== 'delete' && action !== 'restore') ||
            (moduleName !== 'backups' && moduleName !== 'database-backups') ||
            !resourceId) {
            return null;
        }
        try {
            const filename = await this.resolveBackupFilename(resourceId);
            const file = await (0, promises_1.stat)(this.resolveBackupPath(filename));
            const id = this.createBackupId(filename);
            const oldValues = this.sanitizeObject({
                id,
                backup_id: id,
                backupId: id,
                _id: id,
                backup_name: filename,
                filename,
                timestamp: file.birthtime.toISOString(),
                size: file.size,
                status: 'ok',
                database_version: this.dataSource.options.database?.toString() ?? null,
                created_at: file.birthtime,
                download_url: `/backups/${id}/download`,
            });
            if (!oldValues) {
                return null;
            }
            return {
                table_name: 'backups',
                action: action,
                resource_id: String(id),
                old_values: oldValues,
                new_values: null,
                changed_fields: Object.keys(oldValues),
            };
        }
        catch {
            return null;
        }
    }
    resolveBackupPath(filename) {
        if (!/^[a-zA-Z0-9._-]+\.sql$/.test(filename)) {
            throw new Error('Invalid backup filename');
        }
        const filePath = (0, path_1.resolve)((0, path_1.join)(this.backupDir, filename));
        if (!filePath.startsWith(this.backupDir)) {
            throw new Error('Invalid backup filename');
        }
        return filePath;
    }
    async resolveBackupFilename(identifier) {
        if (/^[a-zA-Z0-9._-]+\.sql$/.test(identifier)) {
            return identifier;
        }
        if (!/^\d+$/.test(identifier)) {
            throw new Error('Invalid backup filename');
        }
        const filenames = await (0, promises_1.readdir)(this.backupDir);
        const filename = filenames
            .filter((item) => item.endsWith('.sql'))
            .find((item) => String(this.createBackupId(item)) === identifier);
        if (!filename) {
            throw new Error('Backup not found');
        }
        return filename;
    }
    createBackupId(filename) {
        let hash = 0;
        for (const character of filename) {
            hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
        }
        return (hash % 2147483646) + 1;
    }
    serializeLog(item) {
        const endpoint = item.path;
        const oldPayload = item.old_values ?? null;
        const newPayload = item.new_values ?? item.request_body ?? null;
        const payloadChanges = this.resolvePayloadChangesFromLog(item) ?? item.database_changes ?? null;
        return {
            id: item.id,
            user_id: item.user_id,
            username: item.username,
            user_role: item.user_role,
            action: item.action,
            module: item.module,
            table_name: item.table_name,
            method: item.method,
            path: item.path,
            endpoint,
            target_url: endpoint,
            route: item.route,
            resource_id: item.resource_id,
            status_code: item.status_code,
            duration_ms: item.duration_ms,
            ip_address: item.ip_address,
            user_agent: item.user_agent,
            query_params: item.query_params,
            request_body: item.request_body,
            old_values: item.old_values,
            new_values: item.new_values,
            changed_fields: item.changed_fields,
            old_payload: oldPayload,
            new_payload: newPayload,
            payload_changes: payloadChanges,
            database_changes: item.database_changes,
            metadata: item.metadata,
            created_at: item.created_at,
        };
    }
    resolvePayloadChangesFromLog(item) {
        const metadataChanges = item.metadata?.payload_changes;
        if (metadataChanges &&
            typeof metadataChanges === 'object' &&
            !Array.isArray(metadataChanges)) {
            return metadataChanges;
        }
        return this.toPayloadChanges(item.old_values, item.new_values);
    }
    resolveResourceId(request) {
        const params = request.params ?? {};
        if (typeof params.id === 'string') {
            return params.id;
        }
        if (request.method === 'POST' &&
            /^\/(?:database-backups|backups)\/restore$/.test(request.path) &&
            request.body &&
            typeof request.body === 'object') {
            const filename = request.body.filename;
            if (typeof filename === 'string') {
                return filename;
            }
        }
        const numericSegment = request.path
            .split('/')
            .filter(Boolean)
            .reverse()
            .find((segment) => /^\d+$/.test(segment));
        return numericSegment ?? null;
    }
    resolveIp(request) {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
            return this.truncate(forwardedFor.split(',')[0].trim(), 80);
        }
        return this.truncate(request.ip ?? request.socket.remoteAddress ?? '', 80);
    }
    sanitizeObject(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }
        return this.truncateObject(this.redact(value));
    }
    redact(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.redact(item));
        }
        if (!value || typeof value !== 'object') {
            return value;
        }
        return Object.entries(value).reduce((result, [key, entryValue]) => {
            if (/password|token|secret|authorization/i.test(key)) {
                result[key] = '[REDACTED]';
            }
            else {
                result[key] = this.redact(entryValue);
            }
            return result;
        }, {});
    }
    truncateObject(value) {
        const json = JSON.stringify(value);
        const maxLength = 4000;
        if (!json || json === '{}') {
            return null;
        }
        if (json.length <= maxLength) {
            return value;
        }
        return {
            truncated: true,
            preview: json.slice(0, maxLength),
        };
    }
    keysOf(value) {
        if (!value || typeof value !== 'object') {
            return [];
        }
        return Object.keys(value);
    }
    truncate(value, length) {
        return value.length > length ? value.slice(0, length) : value;
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.AuditLogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        realtime_service_1.RealtimeService,
        audit_log_context_service_1.AuditLogContextService,
        typeorm_2.DataSource])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map