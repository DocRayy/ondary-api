export type AuditDatabaseChange = {
    table_name: string;
    action: 'create' | 'update' | 'delete' | 'restore';
    resource_id: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    changed_fields: string[];
};
export type AuditAuthEvent = {
    event: 'login' | 'logout';
    user_id?: number | null;
    username?: string | null;
    email?: string | null;
    user_role?: string | null;
};
export declare class AuditLogContextService {
    private readonly storage;
    run<T>(callback: () => T): T;
    addDatabaseChange(change: AuditDatabaseChange): void;
    getDatabaseChanges(): AuditDatabaseChange[];
    setEntitySnapshot(key: string, value: Record<string, unknown>): void;
    takeEntitySnapshot(key: string): Record<string, unknown> | null;
    setRequestSnapshot(change: AuditDatabaseChange | null): void;
    getRequestSnapshot(): AuditDatabaseChange | null;
    setAuthEvent(event: AuditAuthEvent | null): void;
    getAuthEvent(): AuditAuthEvent | null;
}
