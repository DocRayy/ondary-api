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
exports.TaskLabelsController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const task_labels_service_1 = require("./task-labels.service");
let TaskLabelsController = class TaskLabelsController {
    taskLabelsService;
    constructor(taskLabelsService) {
        this.taskLabelsService = taskLabelsService;
    }
    create(payload) {
        return this.taskLabelsService.create(payload);
    }
    findAll() {
        return this.taskLabelsService.findAll();
    }
    findOne(params) {
        return this.taskLabelsService.findOne(params.id);
    }
    update(params, payload) {
        return this.taskLabelsService.update(params.id, payload);
    }
    remove(params) {
        return this.taskLabelsService.remove(params.id);
    }
};
exports.TaskLabelsController = TaskLabelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTaskLabelRequest]),
    __metadata("design:returntype", void 0)
], TaskLabelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskLabelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskLabelIdParam]),
    __metadata("design:returntype", void 0)
], TaskLabelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskLabelIdParam,
        dto_1.UpdateTaskLabelRequest]),
    __metadata("design:returntype", void 0)
], TaskLabelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskLabelIdParam]),
    __metadata("design:returntype", void 0)
], TaskLabelsController.prototype, "remove", null);
exports.TaskLabelsController = TaskLabelsController = __decorate([
    (0, common_1.Controller)('task-labels'),
    __metadata("design:paramtypes", [task_labels_service_1.TaskLabelsService])
], TaskLabelsController);
//# sourceMappingURL=task-labels.controller.js.map