import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLogEntity } from '../../database/entities';
import {
  AuditDatabaseChange,
  AuditLogContextService,
} from './audit-log-context.service';

@Injectable()
@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  constructor(
    dataSource: DataSource,
    private readonly auditLogContextService: AuditLogContextService,
  ) {
    dataSource.subscribers.push(this);
  }

  afterInsert(event: InsertEvent<unknown>) {
    if (this.shouldSkip(event.metadata.tableName)) {
      return;
    }

    this.auditLogContextService.addDatabaseChange({
      table_name: event.metadata.tableName,
      action: 'create',
      resource_id: this.resolveResourceId(event.entity),
      old_values: null,
      new_values: this.cleanEntity(event.entity),
      changed_fields: this.keysOf(event.entity),
    });
  }

  async beforeUpdate(event: UpdateEvent<unknown>) {
    if (this.shouldSkip(event.metadata.tableName)) {
      return;
    }

    const resourceId = this.resolveResourceId(
      event.entity ?? event.databaseEntity,
    );
    const oldValues =
      this.cleanEntity(event.databaseEntity) ??
      this.cleanEntity(await this.findCurrentEntity(event, resourceId));

    if (!resourceId || !oldValues) {
      return;
    }

    this.auditLogContextService.setEntitySnapshot(
      this.snapshotKey(event.metadata.tableName, resourceId),
      oldValues,
    );
  }

  afterUpdate(event: UpdateEvent<unknown>) {
    if (this.shouldSkip(event.metadata.tableName)) {
      return;
    }

    const resourceId = this.resolveResourceId(
      event.entity ?? event.databaseEntity,
    );
    const oldValues =
      this.cleanEntity(event.databaseEntity) ??
      (resourceId
        ? this.auditLogContextService.takeEntitySnapshot(
            this.snapshotKey(event.metadata.tableName, resourceId),
          )
        : null);
    const newValues = this.cleanEntity(event.entity);
    const changedFields = this.resolveChangedFields(oldValues, newValues);

    this.auditLogContextService.addDatabaseChange({
      table_name: event.metadata.tableName,
      action: 'update',
      resource_id: resourceId,
      old_values: oldValues,
      new_values: newValues,
      changed_fields: changedFields,
    });
  }

  async beforeRemove(event: RemoveEvent<unknown>) {
    if (this.shouldSkip(event.metadata.tableName)) {
      return;
    }

    const resourceId = this.resolveResourceId(
      event.entity ?? event.databaseEntity,
    );
    const oldValues =
      this.cleanEntity(event.databaseEntity ?? event.entity) ??
      this.cleanEntity(await this.findCurrentEntity(event, resourceId));
    this.auditLogContextService.addDatabaseChange({
      table_name: event.metadata.tableName,
      action: 'delete',
      resource_id: resourceId,
      old_values: oldValues,
      new_values: null,
      changed_fields: this.keysOf(oldValues),
    });
  }

  async beforeSoftRemove(event: SoftRemoveEvent<unknown>) {
    if (this.shouldSkip(event.metadata.tableName)) {
      return;
    }

    const resourceId = this.resolveResourceId(
      event.entity ?? event.databaseEntity,
    );
    const oldValues =
      this.cleanEntity(event.databaseEntity ?? event.entity) ??
      this.cleanEntity(await this.findCurrentEntity(event, resourceId));
    this.auditLogContextService.addDatabaseChange({
      table_name: event.metadata.tableName,
      action: 'delete',
      resource_id: resourceId,
      old_values: oldValues,
      new_values: null,
      changed_fields: this.keysOf(oldValues),
    });
  }

  private shouldSkip(tableName: string) {
    return tableName === 'audit_logs' || tableName === 'typeorm_migrations';
  }

  private resolveResourceId(entity: unknown) {
    if (!entity || typeof entity !== 'object') {
      return null;
    }

    const value = (entity as Record<string, unknown>).id;
    return value === undefined || value === null ? null : String(value);
  }

  private async findCurrentEntity(
    event:
      | UpdateEvent<unknown>
      | RemoveEvent<unknown>
      | SoftRemoveEvent<unknown>,
    resourceId: string | null,
  ) {
    if (!resourceId || !event.metadata.primaryColumns.length) {
      return null;
    }

    const primaryColumn = event.metadata.primaryColumns[0];

    return event.manager.findOne(event.metadata.target, {
      where: {
        [primaryColumn.propertyName]: Number(resourceId),
      } as never,
    });
  }

  private snapshotKey(tableName: string, resourceId: string) {
    return `${tableName}:${resourceId}`;
  }

  private cleanEntity(entity: unknown): Record<string, unknown> | null {
    if (!entity || typeof entity !== 'object') {
      return null;
    }

    return this.redact(JSON.parse(JSON.stringify(entity))) as Record<
      string,
      unknown
    >;
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

  private resolveChangedFields(
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
  ) {
    const keys = new Set([
      ...this.keysOf(oldValues),
      ...this.keysOf(newValues),
    ]);

    return [...keys].filter(
      (key) =>
        JSON.stringify(oldValues?.[key] ?? null) !==
        JSON.stringify(newValues?.[key] ?? null),
    );
  }

  private keysOf(value: unknown) {
    if (!value || typeof value !== 'object') {
      return [];
    }

    return Object.keys(value);
  }
}
