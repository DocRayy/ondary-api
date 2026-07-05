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
exports.TaskAttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photo_upload_config_1 = require("../../common/uploads/photo-upload.config");
const dto_1 = require("./dto");
const task_attachments_service_1 = require("./task-attachments.service");
let TaskAttachmentsController = class TaskAttachmentsController {
    taskAttachmentsService;
    constructor(taskAttachmentsService) {
        this.taskAttachmentsService = taskAttachmentsService;
    }
    create(payload, files = []) {
        return this.taskAttachmentsService.create(payload, files);
    }
    findAll(taskId) {
        return this.taskAttachmentsService.findAll(taskId ? Number(taskId) : undefined);
    }
    findOne(params) {
        return this.taskAttachmentsService.findOne(params.id);
    }
    update(params, payload) {
        return this.taskAttachmentsService.update(params.id, payload);
    }
    remove(params) {
        return this.taskAttachmentsService.remove(params.id);
    }
};
exports.TaskAttachmentsController = TaskAttachmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20, (0, photo_upload_config_1.fileUploadOptions)('task-attachments'))),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTaskAttachmentRequest, Array]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('task_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskAttachmentIdParam]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskAttachmentIdParam,
        dto_1.UpdateTaskAttachmentRequest]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskAttachmentIdParam]),
    __metadata("design:returntype", void 0)
], TaskAttachmentsController.prototype, "remove", null);
exports.TaskAttachmentsController = TaskAttachmentsController = __decorate([
    (0, common_1.Controller)('task-attachments'),
    __metadata("design:paramtypes", [task_attachments_service_1.TaskAttachmentsService])
], TaskAttachmentsController);
//# sourceMappingURL=task-attachments.controller.js.map