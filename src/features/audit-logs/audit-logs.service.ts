import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import {
  Between,
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  In,
  Like,
  MoreThanOrEqual,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { successResponse } from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import {
  AuditLogEntity,
  ManagerNoteEntity,
  NotificationEntity,
  ProjectEntity,
  StickyNoteEntity,
  TaskAttachmentEntity,
  TaskBookmarkEntity,
  TaskCommentEntity,
  TaskEntity,
  TaskFileEntity,
  TaskLabelEntity,
  TaskLabelMapEntity,
  TaskTodoEntity,
  TaskTodoFileEntity,
  TaskTodoUserEntity,
  TaskUserEntity,
  TimelogEntity,
  TimelogFileEntity,
  UserEntity,
} from '../../database/entities';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { RealtimeService } from '../realtime/realtime.service';
import { AuditLogContextService } from './audit-log-context.service';
import type { AuditDatabaseChange } from './audit-log-context.service';
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_FIELDS,
  AUDIT_LOG_MODULES,
} from './audit-log.constants';
import { FindAuditLogsQuery } from './dto';

type RequestWithUser = Request & {
  user?: Partial<AuthenticatedUser>;
  route?: { path?: string };
};

type JwtPayload = {
  sub: number;
  username: string;
};

type PayloadChanges = Record<string, { before: unknown; after: unknown }>;

const VISIBLE_ACTIVITY_ACTIONS = [
  'create',
  'update',
  'delete',
  'restore',
  'generate_pdf',
] as const;

const VALID_AUDIT_LOG_MODULES = AUDIT_LOG_MODULES as readonly string[];

@Injectable()
export class AuditLogsService {
  private readonly backupDir = resolve(process.cwd(), 'storage', 'backups');

  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogsRepository: Repository<AuditLogEntity>,
    private readonly jwtService: JwtService,
    private readonly realtimeService: RealtimeService,
    private readonly auditLogContextService: AuditLogContextService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: FindAuditLogsQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: FindOptionsWhere<AuditLogEntity>[] = [];
    const baseWhere: FindOptionsWhere<AuditLogEntity> = {};

    if (query.action) {
      baseWhere.action = (VISIBLE_ACTIVITY_ACTIONS as readonly string[]).includes(
        query.action,
      )
        ? query.action
        : In([]);
    } else {
      baseWhere.action = In([...VISIBLE_ACTIVITY_ACTIONS]);
    }
    if (query.module) {
      baseWhere.module = VALID_AUDIT_LOG_MODULES.includes(query.module)
        ? query.module
        : In([]);
    }
    if (query.user_id) {
      baseWhere.user_id = query.user_id;
    }
    const dateRange = this.resolveDateRange(query);
    if (dateRange.from && dateRange.to) {
      baseWhere.created_at = Between(
        dateRange.from,
        dateRange.to,
      );
    } else if (dateRange.from) {
      baseWhere.created_at = MoreThanOrEqual(dateRange.from);
    }

    if (query.search) {
      where.push(
        { ...baseWhere, username: Like(`%${query.search}%`) },
        { ...baseWhere, path: Like(`%${query.search}%`) },
        { ...baseWhere, module: Like(`%${query.search}%`) },
      );
    }

    const [items, total] = await this.auditLogsRepository.findAndCount({
      where: where.length > 0 ? where : baseWhere,
      relations: { user: true },
      order: { created_at: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse(
      'Audit Logs Retrieved',
      'Audit logs retrieved successfully',
      {
        items: removePasswords(items.map((item) => this.serializeLog(item))),
        meta: {
          total,
          page,
          limit,
          page_count: Math.ceil(total / limit),
          limit_options: [10, 25, 50, 100],
        },
      },
    );
  }

  meta() {
    return successResponse(
      'Audit Log Metadata Retrieved',
      'Audit log metadata retrieved successfully',
      {
        fields: AUDIT_LOG_FIELDS,
        actions: AUDIT_LOG_ACTIONS,
        modules: AUDIT_LOG_MODULES,
        limit_options: [10, 25, 50, 100],
        default_limit: 10,
        socket_event: 'audit-log.created',
      },
    );
  }

  async captureRequestSnapshot(request: RequestWithUser) {
    const action = this.resolveAction(request.method, request.path);
    if (action !== 'update' && action !== 'delete' && action !== 'restore') {
      this.auditLogContextService.setRequestSnapshot(null);
      return;
    }

    const resourceId = this.resolveResourceId(request);
    const backupSnapshot = await this.resolveBackupRequestSnapshot(
      request,
      action,
      resourceId,
    );
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
      const oldValues = this.sanitizeObject(
        await this.findEntitySnapshot(repository, resourceId),
      );

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
        changed_fields:
          this.resolveFallbackChangedFields(this.sanitizeObject(request.body)) ??
          [],
      });
    } catch {
      this.auditLogContextService.setRequestSnapshot(null);
    }
  }

  private resolveDateRange(query: FindAuditLogsQuery) {
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

  async recordRequest(
    request: RequestWithUser,
    statusCode: number,
    durationMs: number,
    error?: unknown,
  ) {
    const user = await this.resolveUser(request);
    const path = request.originalUrl ?? request.url;
    const moduleName = this.resolveModule(request.path);
    const action = this.resolveAction(request.method, request.path);
    if (
      !this.isVisibleAction(action) ||
      !VALID_AUDIT_LOG_MODULES.includes(moduleName)
    ) {
      return;
    }

    const databaseChanges = this.auditLogContextService.getDatabaseChanges();
    const requestSnapshot = this.auditLogContextService.getRequestSnapshot();
    const primaryChange = this.resolvePrimaryChange(
      databaseChanges,
      action,
      requestSnapshot,
    );
    const requestBody = this.sanitizeObject(request.body);
    const authEvent = await this.resolveAuthEvent(request, statusCode);
    const fallbackNewValues = this.resolveFallbackNewValues(
      action,
      request,
      path,
      requestSnapshot?.old_values ?? null,
      requestBody,
    );
    const oldValues = this.resolveOldValues(
      action,
      requestSnapshot?.old_values ?? null,
      primaryChange?.old_values ?? null,
    );
    const newValues = this.resolveCompleteNewValues(
      action,
      oldValues,
      primaryChange?.new_values ?? null,
      fallbackNewValues,
    );
    const changedFields =
      this.resolveChangedFields(oldValues, newValues) ??
      this.nonEmptyFields(primaryChange?.changed_fields) ??
      requestSnapshot?.changed_fields ??
      this.resolveFallbackChangedFields(newValues);
    const auditPayload = this.resolveAuditPayload(
      action,
      oldValues,
      newValues,
      changedFields,
    );
    const metadata = this.resolveMetadata(error, authEvent, auditPayload);
    const auditLog = await this.auditLogsRepository.save(
      this.auditLogsRepository.create({
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
        user_agent: this.truncate(
          String(request.headers['user-agent'] ?? ''),
          255,
        ),
        query_params: this.sanitizeObject(request.query),
        request_body: requestBody,
        old_values: auditPayload.old_values,
        new_values: auditPayload.new_values,
        changed_fields: auditPayload.changed_fields,
        database_changes: databaseChanges.length > 0 ? databaseChanges : null,
        metadata,
      }),
    );

    this.realtimeService.emitAuditLog(auditLog);
  }

  private resolvePrimaryChange(
    databaseChanges: ReturnType<AuditLogContextService['getDatabaseChanges']>,
    action: string,
    requestSnapshot: ReturnType<AuditLogContextService['getRequestSnapshot']>,
  ) {
    if (databaseChanges.length === 0) {
      return null;
    }

    if (requestSnapshot) {
      const endpointChange = databaseChanges.find(
        (change) =>
          change.action === action &&
          change.table_name === requestSnapshot.table_name &&
          change.resource_id === requestSnapshot.resource_id,
      );

      if (endpointChange) {
        return endpointChange;
      }

      return null;
    }

    return (
      databaseChanges.find((change) => change.action === action) ??
      databaseChanges[0]
    );
  }

  private resolveOldValues(
    action: string,
    requestOldValues: Record<string, unknown> | null,
    primaryOldValues: Record<string, unknown> | null,
  ) {
    if (action === 'update' || action === 'delete' || action === 'restore') {
      return requestOldValues ?? primaryOldValues;
    }

    return primaryOldValues ?? requestOldValues;
  }

  private resolveCompleteNewValues(
    action: string,
    oldValues: Record<string, unknown> | null,
    primaryNewValues: Record<string, unknown> | null,
    fallbackNewValues: Record<string, unknown> | null,
  ) {
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

  private async resolveUser(request: RequestWithUser) {
    if (request.user) {
      return request.user;
    }

    const authorization = request.headers.authorization;
    if (!authorization) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        authorization.replace(/^Bearer\s+/i, ''),
      );

      return {
        id: payload.sub,
        username: payload.username,
        email: '',
        name: payload.username,
        role: '',
        status: 'active',
      } as AuthenticatedUser;
    } catch {
      return null;
    }
  }

  private resolveAction(method: string, path: string) {
    if (
      method === 'POST' &&
      (path === '/auth/login' || path === '/auth/logout')
    ) {
      return 'create';
    }
    if (method === 'GET' && path === '/task/report/pdf') {
      return 'generate_pdf';
    }
    if (
      method === 'POST' &&
      (/^\/(?:database-backups|backups)\/[^/]+\/restore$/.test(path) ||
        /^\/(?:database-backups|backups)\/restore$/.test(path))
    ) {
      return 'restore';
    }

    const actionByMethod: Record<string, string> = {
      POST: 'create',
      PATCH: 'update',
      PUT: 'update',
      DELETE: 'delete',
    };

    return actionByMethod[method] ?? 'unknown';
  }

  private resolveModule(path: string) {
    if (path === '/task/report/pdf') {
      return 'reports';
    }

    const [moduleName] = path.split('/').filter(Boolean);
    if (moduleName === 'backups') {
      return 'database-backups';
    }

    return moduleName || 'root';
  }

  private isVisibleAction(action: string) {
    return (VISIBLE_ACTIVITY_ACTIONS as readonly string[]).includes(action);
  }

  private resolveFallbackNewValues(
    action: string,
    request: RequestWithUser,
    targetUrl: string,
    oldValues: Record<string, unknown> | null,
    requestBody: Record<string, unknown> | null,
  ) {
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

  private resolveFallbackChangedFields(
    newValues: Record<string, unknown> | null,
  ) {
    if (!newValues) {
      return null;
    }

    return Object.keys(newValues);
  }

  private resolveChangedFields(
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
  ) {
    if (!oldValues || !newValues) {
      return null;
    }

    const changedFields = Object.keys(newValues).filter(
      (key) =>
        JSON.stringify(oldValues[key] ?? null) !==
        JSON.stringify(newValues[key] ?? null),
    );

    return this.nonEmptyFields(changedFields);
  }

  private nonEmptyFields(fields: string[] | null | undefined) {
    return fields && fields.length > 0 ? fields : null;
  }

  private resolveAuditPayload(
    action: string,
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
    changedFields: string[] | null,
  ) {
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
        } as PayloadChanges,
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

  private pickFields(
    value: Record<string, unknown> | null,
    fields: string[],
  ) {
    if (!value || fields.length === 0) {
      return null;
    }

    return fields.reduce(
      (result, field) => {
        result[field] = value[field] ?? null;
        return result;
      },
      {} as Record<string, unknown>,
    );
  }

  private toPayloadChanges(
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
  ): PayloadChanges | null {
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
    }, {} as PayloadChanges);
  }

  private async resolveAuthEvent(
    request: RequestWithUser,
    statusCode: number,
  ) {
    const contextEvent = this.auditLogContextService.getAuthEvent();
    if (contextEvent) {
      return contextEvent;
    }

    if (request.method === 'POST' && request.path === '/auth/logout') {
      return {
        event: 'logout' as const,
        user_id: request.user?.id ?? null,
        username: request.user?.username ?? null,
        user_role: request.user?.role ?? null,
      };
    }

    if (
      request.method !== 'POST' ||
      request.path !== '/auth/login' ||
      statusCode >= 400
    ) {
      return null;
    }

    const identifier = this.resolveLoginIdentifier(request.body);
    if (!identifier) {
      return { event: 'login' as const };
    }

    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: [{ username: identifier }, { email: identifier }],
    });

    return {
      event: 'login' as const,
      username: user?.username ?? identifier,
      email: user?.email ?? identifier,
      user_id: user?.id ?? null,
      user_role: user?.role ?? null,
    };
  }

  private resolveLoginIdentifier(body: unknown) {
    if (!body || typeof body !== 'object') {
      return null;
    }

    const payload = body as Record<string, unknown>;
    const identifier = payload.identifier ?? payload.username ?? payload.email;
    return typeof identifier === 'string' ? identifier : null;
  }

  private resolveMetadata(
    error: unknown,
    authEvent: Awaited<ReturnType<AuditLogsService['resolveAuthEvent']>>,
    auditPayload: { payload_changes: PayloadChanges | null },
  ) {
    const metadata: Record<string, unknown> = {};

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

  private resolveSnapshotEntity(
    path: string,
  ): EntityTarget<ObjectLiteral> | null {
    const [moduleName] = path.split('/').filter(Boolean);
    const entitiesByModule: Record<string, EntityTarget<ObjectLiteral>> = {
      users: UserEntity,
      projects: ProjectEntity,
      task: TaskEntity,
      'task-attachments': TaskAttachmentEntity,
      'task-bookmarks': TaskBookmarkEntity,
      'task-comments': TaskCommentEntity,
      'task-files': TaskFileEntity,
      'task-labels': TaskLabelEntity,
      'task-label-maps': TaskLabelMapEntity,
      'task-todos': TaskTodoEntity,
      'task-todo-files': TaskTodoFileEntity,
      'task-users': TaskUserEntity,
      timelogs: TimelogEntity,
      'timelog-file': TimelogFileEntity,
      'sticky-notes': StickyNoteEntity,
      'manager-notes': ManagerNoteEntity,
      notifications: NotificationEntity,
    };

    return moduleName ? (entitiesByModule[moduleName] ?? null) : null;
  }

  private async findEntitySnapshot(
    repository: Repository<ObjectLiteral>,
    resourceId: string,
  ) {
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

  private parsePrimaryKeyValue(value: string) {
    return /^\d+$/.test(value) ? Number(value) : value;
  }

  private async resolveBackupRequestSnapshot(
    request: RequestWithUser,
    action: string,
    resourceId: string | null,
  ): Promise<AuditDatabaseChange | null> {
    const [moduleName] = request.path.split('/').filter(Boolean);
    if (
      (action !== 'delete' && action !== 'restore') ||
      (moduleName !== 'backups' && moduleName !== 'database-backups') ||
      !resourceId
    ) {
      return null;
    }

    try {
      const filename = await this.resolveBackupFilename(resourceId);
      const file = await stat(this.resolveBackupPath(filename));
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
        database_version:
          this.dataSource.options.database?.toString() ?? null,
        created_at: file.birthtime,
        download_url: `/backups/${id}/download`,
      });

      if (!oldValues) {
        return null;
      }

      return {
        table_name: 'backups',
        action: action as 'delete' | 'restore',
        resource_id: String(id),
        old_values: oldValues,
        new_values: null,
        changed_fields: Object.keys(oldValues),
      };
    } catch {
      return null;
    }
  }

  private resolveBackupPath(filename: string) {
    if (!/^[a-zA-Z0-9._-]+\.sql$/.test(filename)) {
      throw new Error('Invalid backup filename');
    }

    const filePath = resolve(join(this.backupDir, filename));
    if (!filePath.startsWith(this.backupDir)) {
      throw new Error('Invalid backup filename');
    }

    return filePath;
  }

  private async resolveBackupFilename(identifier: string) {
    if (/^[a-zA-Z0-9._-]+\.sql$/.test(identifier)) {
      return identifier;
    }

    if (!/^\d+$/.test(identifier)) {
      throw new Error('Invalid backup filename');
    }

    const filenames = await readdir(this.backupDir);
    const filename = filenames
      .filter((item) => item.endsWith('.sql'))
      .find((item) => String(this.createBackupId(item)) === identifier);

    if (!filename) {
      throw new Error('Backup not found');
    }

    return filename;
  }

  private createBackupId(filename: string) {
    let hash = 0;

    for (const character of filename) {
      hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    }

    return (hash % 2147483646) + 1;
  }

  private serializeLog(item: AuditLogEntity) {
    const endpoint = item.path;
    const oldPayload = item.old_values ?? null;
    const newPayload = item.new_values ?? item.request_body ?? null;
    const payloadChanges =
      this.resolvePayloadChangesFromLog(item) ?? item.database_changes ?? null;

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

  private resolvePayloadChangesFromLog(item: AuditLogEntity) {
    const metadataChanges = item.metadata?.payload_changes;
    if (
      metadataChanges &&
      typeof metadataChanges === 'object' &&
      !Array.isArray(metadataChanges)
    ) {
      return metadataChanges as PayloadChanges;
    }

    return this.toPayloadChanges(item.old_values, item.new_values);
  }

  private resolveResourceId(request: RequestWithUser) {
    const params = request.params ?? {};
    if (typeof params.id === 'string') {
      return params.id;
    }

    if (
      request.method === 'POST' &&
      /^\/(?:database-backups|backups)\/restore$/.test(request.path) &&
      request.body &&
      typeof request.body === 'object'
    ) {
      const filename = (request.body as Record<string, unknown>).filename;
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

  private resolveIp(request: Request) {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      return this.truncate(forwardedFor.split(',')[0].trim(), 80);
    }

    return this.truncate(request.ip ?? request.socket.remoteAddress ?? '', 80);
  }

  private sanitizeObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    return this.truncateObject(this.redact(value));
  }

  private redact(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.redact(item));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    return Object.entries(value as Record<string, unknown>).reduce(
      (result, [key, entryValue]) => {
        if (/password|token|secret|authorization/i.test(key)) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = this.redact(entryValue);
        }
        return result;
      },
      {} as Record<string, unknown>,
    );
  }

  private truncateObject(value: unknown): Record<string, unknown> | null {
    const json = JSON.stringify(value);
    const maxLength = 4000;

    if (!json || json === '{}') {
      return null;
    }

    if (json.length <= maxLength) {
      return value as Record<string, unknown>;
    }

    return {
      truncated: true,
      preview: json.slice(0, maxLength),
    };
  }

  private keysOf(value: unknown) {
    if (!value || typeof value !== 'object') {
      return [];
    }

    return Object.keys(value);
  }

  private truncate(value: string, length: number) {
    return value.length > length ? value.slice(0, length) : value;
  }
}
