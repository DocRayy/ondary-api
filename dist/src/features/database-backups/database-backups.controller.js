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
exports.DatabaseBackupsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../auth/guards/admin.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const database_backups_service_1 = require("./database-backups.service");
const dto_1 = require("./dto");
let DatabaseBackupsController = class DatabaseBackupsController {
    databaseBackupsService;
    constructor(databaseBackupsService) {
        this.databaseBackupsService = databaseBackupsService;
    }
    findAll(query) {
        return this.databaseBackupsService.findAll(query);
    }
    create() {
        return this.databaseBackupsService.create();
    }
    restore(payload) {
        return this.databaseBackupsService.restore(payload.filename);
    }
    restoreById(id) {
        return this.databaseBackupsService.restore(id);
    }
    async download(filename, response) {
        const download = await this.databaseBackupsService.getDownloadPath(filename);
        return response.download(download.filePath, download.filename);
    }
    remove(id) {
        return this.databaseBackupsService.remove(id);
    }
};
exports.DatabaseBackupsController = DatabaseBackupsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindDatabaseBackupsQuery]),
    __metadata("design:returntype", void 0)
], DatabaseBackupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DatabaseBackupsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RestoreDatabaseBackupRequest]),
    __metadata("design:returntype", void 0)
], DatabaseBackupsController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DatabaseBackupsController.prototype, "restoreById", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseBackupsController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DatabaseBackupsController.prototype, "remove", null);
exports.DatabaseBackupsController = DatabaseBackupsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Controller)(['database-backups', 'backups']),
    __metadata("design:paramtypes", [database_backups_service_1.DatabaseBackupsService])
], DatabaseBackupsController);
//# sourceMappingURL=database-backups.controller.js.map