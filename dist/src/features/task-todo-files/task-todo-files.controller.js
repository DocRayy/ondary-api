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
exports.TaskTodoFilesController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const task_todo_files_service_1 = require("./task-todo-files.service");
let TaskTodoFilesController = class TaskTodoFilesController {
    taskTodoFilesService;
    constructor(taskTodoFilesService) {
        this.taskTodoFilesService = taskTodoFilesService;
    }
    create(payload) {
        return this.taskTodoFilesService.create(payload);
    }
    findAll() {
        return this.taskTodoFilesService.findAll();
    }
    findOne(params) {
        return this.taskTodoFilesService.findOne(params.id);
    }
    update(params, payload) {
        return this.taskTodoFilesService.update(params.id, payload);
    }
    remove(params) {
        return this.taskTodoFilesService.remove(params.id);
    }
};
exports.TaskTodoFilesController = TaskTodoFilesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTaskTodoFileRequest]),
    __metadata("design:returntype", void 0)
], TaskTodoFilesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskTodoFilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskTodoFileIdParam]),
    __metadata("design:returntype", void 0)
], TaskTodoFilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskTodoFileIdParam,
        dto_1.UpdateTaskTodoFileRequest]),
    __metadata("design:returntype", void 0)
], TaskTodoFilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskTodoFileIdParam]),
    __metadata("design:returntype", void 0)
], TaskTodoFilesController.prototype, "remove", null);
exports.TaskTodoFilesController = TaskTodoFilesController = __decorate([
    (0, common_1.Controller)('task-todo-files'),
    __metadata("design:paramtypes", [task_todo_files_service_1.TaskTodoFilesService])
], TaskTodoFilesController);
//# sourceMappingURL=task-todo-files.controller.js.map