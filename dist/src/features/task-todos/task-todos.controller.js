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
exports.TaskTodosController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const task_todos_service_1 = require("./task-todos.service");
let TaskTodosController = class TaskTodosController {
    taskTodosService;
    constructor(taskTodosService) {
        this.taskTodosService = taskTodosService;
    }
    create(payload) {
        return this.taskTodosService.create(payload);
    }
    findAll() {
        return this.taskTodosService.findAll();
    }
    findOne(params) {
        return this.taskTodosService.findOne(params.id);
    }
    update(params, payload) {
        return this.taskTodosService.update(params.id, payload);
    }
    remove(params) {
        return this.taskTodosService.remove(params.id);
    }
};
exports.TaskTodosController = TaskTodosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTaskTodoRequest]),
    __metadata("design:returntype", void 0)
], TaskTodosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskTodosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskTodoIdParam]),
    __metadata("design:returntype", void 0)
], TaskTodosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskTodoIdParam,
        dto_1.UpdateTaskTodoRequest]),
    __metadata("design:returntype", void 0)
], TaskTodosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskTodoIdParam]),
    __metadata("design:returntype", void 0)
], TaskTodosController.prototype, "remove", null);
exports.TaskTodosController = TaskTodosController = __decorate([
    (0, common_1.Controller)('task-todos'),
    __metadata("design:paramtypes", [task_todos_service_1.TaskTodosService])
], TaskTodosController);
//# sourceMappingURL=task-todos.controller.js.map