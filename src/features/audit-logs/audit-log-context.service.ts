import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

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

type AuditLogContext = {
  database_changes: AuditDatabaseChange[];
  entity_snapshots: Map<string, Record<string, unknown>>;
  request_snapshot: AuditDatabaseChange | null;
  auth_event: AuditAuthEvent | null;
};

@Injectable()
export class AuditLogContextService {
  private readonly storage = new AsyncLocalStorage<AuditLogContext>();

  run<T>(callback: () => T): T {
    return this.storage.run(
      {
        database_changes: [],
        entity_snapshots: new Map(),
        request_snapshot: null,
        auth_event: null,
      },
      callback,
    );
  }

  addDatabaseChange(change: AuditDatabaseChange) {
    this.storage.getStore()?.database_changes.push(change);
  }

  getDatabaseChanges() {
    return this.storage.getStore()?.database_changes ?? [];
  }

  setEntitySnapshot(key: string, value: Record<string, unknown>) {
    this.storage.getStore()?.entity_snapshots.set(key, value);
  }

  takeEntitySnapshot(key: string) {
    const store = this.storage.getStore();
    const value = store?.entity_snapshots.get(key) ?? null;
    store?.entity_snapshots.delete(key);
    return value;
  }

  setRequestSnapshot(change: AuditDatabaseChange | null) {
    const store = this.storage.getStore();
    if (store) {
      store.request_snapshot = change;
    }
  }

  getRequestSnapshot() {
    return this.storage.getStore()?.request_snapshot ?? null;
  }

  setAuthEvent(event: AuditAuthEvent | null) {
    const store = this.storage.getStore();
    if (store) {
      store.auth_event = event;
    }
  }

  getAuthEvent() {
    return this.storage.getStore()?.auth_event ?? null;
  }
}
