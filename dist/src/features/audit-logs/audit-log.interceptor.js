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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const audit_log_context_service_1 = require("./audit-log-context.service");
const audit_logs_service_1 = require("./audit-logs.service");
let AuditLogInterceptor = class AuditLogInterceptor {
    auditLogsService;
    auditLogContextService;
    constructor(auditLogsService, auditLogContextService) {
        this.auditLogsService = auditLogsService;
        this.auditLogContextService = auditLogContextService;
    }
    intercept(context, next) {
        if (context.getType() !== 'http') {
            return next.handle();
        }
        const request = context
            .switchToHttp()
            .getRequest();
        const response = context.switchToHttp().getResponse();
        const startedAt = Date.now();
        return this.auditLogContextService.run(() => (0, rxjs_1.from)(this.auditLogsService.captureRequestSnapshot(request)).pipe((0, rxjs_1.mergeMap)(() => next.handle().pipe((0, rxjs_1.tap)(() => {
            void this.auditLogsService.recordRequest(request, response.statusCode, Date.now() - startedAt);
        }), (0, rxjs_1.catchError)((error) => {
            const statusCode = typeof error === 'object' && error && 'status' in error
                ? Number(error.status)
                : response.statusCode || 500;
            void this.auditLogsService.recordRequest(request, statusCode, Date.now() - startedAt, error);
            return (0, rxjs_1.throwError)(() => error);
        })))));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_logs_service_1.AuditLogsService,
        audit_log_context_service_1.AuditLogContextService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map