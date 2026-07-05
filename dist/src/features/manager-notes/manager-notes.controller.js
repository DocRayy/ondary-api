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
exports.ManagerNotesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const manager_guard_1 = require("../auth/guards/manager.guard");
const dto_1 = require("./dto");
const manager_notes_service_1 = require("./manager-notes.service");
let ManagerNotesController = class ManagerNotesController {
    managerNotesService;
    constructor(managerNotesService) {
        this.managerNotesService = managerNotesService;
    }
    create(payload) {
        return this.managerNotesService.create(payload);
    }
    findAll() {
        return this.managerNotesService.findAll();
    }
    findRecipients() {
        return this.managerNotesService.findRecipients();
    }
    findOne(params) {
        return this.managerNotesService.findOne(params.id);
    }
    update(params, payload) {
        return this.managerNotesService.update(params.id, payload);
    }
    remove(params) {
        return this.managerNotesService.remove(params.id);
    }
};
exports.ManagerNotesController = ManagerNotesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, manager_guard_1.ManagerGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateManagerNoteRequest]),
    __metadata("design:returntype", void 0)
], ManagerNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManagerNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, manager_guard_1.ManagerGuard),
    (0, common_1.Get)('recipients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManagerNotesController.prototype, "findRecipients", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ManagerNoteIdParam]),
    __metadata("design:returntype", void 0)
], ManagerNotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ManagerNoteIdParam,
        dto_1.UpdateManagerNoteRequest]),
    __metadata("design:returntype", void 0)
], ManagerNotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ManagerNoteIdParam]),
    __metadata("design:returntype", void 0)
], ManagerNotesController.prototype, "remove", null);
exports.ManagerNotesController = ManagerNotesController = __decorate([
    (0, common_1.Controller)('manager-notes'),
    __metadata("design:paramtypes", [manager_notes_service_1.ManagerNotesService])
], ManagerNotesController);
//# sourceMappingURL=manager-notes.controller.js.map