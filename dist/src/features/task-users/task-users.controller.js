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
exports.TaskUsersController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const task_users_service_1 = require("./task-users.service");
let TaskUsersController = class TaskUsersController {
    taskUsersService;
    constructor(taskUsersService) {
        this.taskUsersService = taskUsersService;
    }
    create(payload) {
        return this.taskUsersService.create(payload);
    }
    findAll() {
        return this.taskUsersService.findAll();
    }
    findOne(params) {
        return this.taskUsersService.findOne(params.id);
    }
    update(params, payload) {
        return this.taskUsersService.update(params.id, payload);
    }
    remove(params) {
        return this.taskUsersService.remove(params.id);
    }
};
exports.TaskUsersController = TaskUsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTaskUserRequest]),
    __metadata("design:returntype", void 0)
], TaskUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskUserIdParam]),
    __metadata("design:returntype", void 0)
], TaskUsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskUserIdParam,
        dto_1.UpdateTaskUserRequest]),
    __metadata("design:returntype", void 0)
], TaskUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskUserIdParam]),
    __metadata("design:returntype", void 0)
], TaskUsersController.prototype, "remove", null);
exports.TaskUsersController = TaskUsersController = __decorate([
    (0, common_1.Controller)('task-users'),
    __metadata("design:paramtypes", [task_users_service_1.TaskUsersService])
], TaskUsersController);
//# sourceMappingURL=task-users.controller.js.map