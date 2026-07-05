import { DataSource, EntitySubscriberInterface, InsertEvent, RemoveEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';
import { AuditLogContextService } from './audit-log-context.service';
export declare class AuditLogSubscriber implements EntitySubscriberInterface {
    private readonly auditLogContextService;
    constructor(dataSource: DataSource, auditLogContextService: AuditLogContextService);
    afterInsert(event: InsertEvent<unknown>): void;
    beforeUpdate(event: UpdateEvent<unknown>): Promise<void>;
    afterUpdate(event: UpdateEvent<unknown>): void;
    beforeRemove(event: RemoveEvent<unknown>): Promise<void>;
    beforeSoftRemove(event: SoftRemoveEvent<unknown>): Promise<void>;
    private shouldSkip;
    private resolveResourceId;
    private findCurrentEntity;
    private snapshotKey;
    private cleanEntity;
    private redact;
    private resolveChangedFields;
    private keysOf;
}
