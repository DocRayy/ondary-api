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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogSubscriber = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const audit_log_context_service_1 = require("./audit-log-context.service");
let AuditLogSubscriber = class AuditLogSubscriber {
    auditLogContextService;
    constructor(dataSource, auditLogContextService) {
        this.auditLogContextService = auditLogContextService;
        dataSource.subscribers.push(this);
    }
    afterInsert(event) {
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
    async beforeUpdate(event) {
        if (this.shouldSkip(event.metadata.tableName)) {
            return;
        }
        const resourceId = this.resolveResourceId(event.entity ?? event.databaseEntity);
        const oldValues = this.cleanEntity(event.databaseEntity) ??
            this.cleanEntity(await this.findCurrentEntity(event, resourceId));
        if (!resourceId || !oldValues) {
            return;
        }
        this.auditLogContextService.setEntitySnapshot(this.snapshotKey(event.metadata.tableName, resourceId), oldValues);
    }
    afterUpdate(event) {
        if (this.shouldSkip(event.metadata.tableName)) {
            return;
        }
        const resourceId = this.resolveResourceId(event.entity ?? event.databaseEntity);
        const oldValues = this.cleanEntity(event.databaseEntity) ??
            (resourceId
                ? this.auditLogContextService.takeEntitySnapshot(this.snapshotKey(event.metadata.tableName, resourceId))
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
    async beforeRemove(event) {
        if (this.shouldSkip(event.metadata.tableName)) {
            return;
        }
        const resourceId = this.resolveResourceId(event.entity ?? event.databaseEntity);
        const oldValues = this.cleanEntity(event.databaseEntity ?? event.entity) ??
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
    async beforeSoftRemove(event) {
        if (this.shouldSkip(event.metadata.tableName)) {
            return;
        }
        const resourceId = this.resolveResourceId(event.entity ?? event.databaseEntity);
        const oldValues = this.cleanEntity(event.databaseEntity ?? event.entity) ??
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
    shouldSkip(tableName) {
        return tableName === 'audit_logs' || tableName === 'typeorm_migrations';
    }
    resolveResourceId(entity) {
        if (!entity || typeof entity !== 'object') {
            return null;
        }
        const value = entity.id;
        return value === undefined || value === null ? null : String(value);
    }
    async findCurrentEntity(event, resourceId) {
        if (!resourceId || !event.metadata.primaryColumns.length) {
            return null;
        }
        const primaryColumn = event.metadata.primaryColumns[0];
        return event.manager.findOne(event.metadata.target, {
            where: {
                [primaryColumn.propertyName]: Number(resourceId),
            },
        });
    }
    snapshotKey(tableName, resourceId) {
        return `${tableName}:${resourceId}`;
    }
    cleanEntity(entity) {
        if (!entity || typeof entity !== 'object') {
            return null;
        }
        return this.redact(JSON.parse(JSON.stringify(entity)));
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
    resolveChangedFields(oldValues, newValues) {
        const keys = new Set([
            ...this.keysOf(oldValues),
            ...this.keysOf(newValues),
        ]);
        return [...keys].filter((key) => JSON.stringify(oldValues?.[key] ?? null) !==
            JSON.stringify(newValues?.[key] ?? null));
    }
    keysOf(value) {
        if (!value || typeof value !== 'object') {
            return [];
        }
        return Object.keys(value);
    }
};
exports.AuditLogSubscriber = AuditLogSubscriber;
exports.AuditLogSubscriber = AuditLogSubscriber = __decorate([
    (0, common_1.Injectable)(),
    (0, typeorm_1.EventSubscriber)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        audit_log_context_service_1.AuditLogContextService])
], AuditLogSubscriber);
//# sourceMappingURL=audit-log.subscriber.js.map