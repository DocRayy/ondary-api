"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../database/entities");
const auth_module_1 = require("../auth/auth.module");
const realtime_module_1 = require("../realtime/realtime.module");
const audit_log_interceptor_1 = require("./audit-log.interceptor");
const audit_log_context_service_1 = require("./audit-log-context.service");
const audit_log_subscriber_1 = require("./audit-log.subscriber");
const audit_logs_controller_1 = require("./audit-logs.controller");
const audit_logs_service_1 = require("./audit-logs.service");
let AuditLogsModule = class AuditLogsModule {
};
exports.AuditLogsModule = AuditLogsModule;
exports.AuditLogsModule = AuditLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.AuditLogEntity]),
            auth_module_1.AuthModule,
            realtime_module_1.RealtimeModule,
        ],
        controllers: [audit_logs_controller_1.AuditLogsController],
        providers: [
            audit_logs_service_1.AuditLogsService,
            audit_log_context_service_1.AuditLogContextService,
            audit_log_subscriber_1.AuditLogSubscriber,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
        ],
    })
], AuditLogsModule);
//# sourceMappingURL=audit-logs.module.js.map