"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogContextService = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
let AuditLogContextService = class AuditLogContextService {
    storage = new async_hooks_1.AsyncLocalStorage();
    run(callback) {
        return this.storage.run({
            database_changes: [],
            entity_snapshots: new Map(),
            request_snapshot: null,
            auth_event: null,
        }, callback);
    }
    addDatabaseChange(change) {
        this.storage.getStore()?.database_changes.push(change);
    }
    getDatabaseChanges() {
        return this.storage.getStore()?.database_changes ?? [];
    }
    setEntitySnapshot(key, value) {
        this.storage.getStore()?.entity_snapshots.set(key, value);
    }
    takeEntitySnapshot(key) {
        const store = this.storage.getStore();
        const value = store?.entity_snapshots.get(key) ?? null;
        store?.entity_snapshots.delete(key);
        return value;
    }
    setRequestSnapshot(change) {
        const store = this.storage.getStore();
        if (store) {
            store.request_snapshot = change;
        }
    }
    getRequestSnapshot() {
        return this.storage.getStore()?.request_snapshot ?? null;
    }
    setAuthEvent(event) {
        const store = this.storage.getStore();
        if (store) {
            store.auth_event = event;
        }
    }
    getAuthEvent() {
        return this.storage.getStore()?.auth_event ?? null;
    }
};
exports.AuditLogContextService = AuditLogContextService;
exports.AuditLogContextService = AuditLogContextService = __decorate([
    (0, common_1.Injectable)()
], AuditLogContextService);
//# sourceMappingURL=audit-log-context.service.js.map