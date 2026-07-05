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
exports.TaskCommentsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dto_1 = require("./dto");
const task_comments_service_1 = require("./task-comments.service");
let TaskCommentsController = class TaskCommentsController {
    taskCommentsService;
    constructor(taskCommentsService) {
        this.taskCommentsService = taskCommentsService;
    }
    findAll(query) {
        return this.taskCommentsService.findAll(query);
    }
    create(payload, user) {
        return this.taskCommentsService.create(payload, user.id);
    }
    findOne(params) {
        return this.taskCommentsService.findOne(params.id);
    }
    update(params, payload) {
        return this.taskCommentsService.update(params.id, payload);
    }
    remove(params) {
        return this.taskCommentsService.remove(params.id);
    }
};
exports.TaskCommentsController = TaskCommentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindTaskCommentsQuery]),
    __metadata("design:returntype", void 0)
], TaskCommentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTaskCommentRequest, Object]),
    __metadata("design:returntype", void 0)
], TaskCommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskCommentIdParam]),
    __metadata("design:returntype", void 0)
], TaskCommentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskCommentIdParam,
        dto_1.UpdateTaskCommentRequest]),
    __metadata("design:returntype", void 0)
], TaskCommentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TaskCommentIdParam]),
    __metadata("design:returntype", void 0)
], TaskCommentsController.prototype, "remove", null);
exports.TaskCommentsController = TaskCommentsController = __decorate([
    (0, common_1.Controller)('task-comments'),
    __metadata("design:paramtypes", [task_comments_service_1.TaskCommentsService])
], TaskCommentsController);
//# sourceMappingURL=task-comments.controller.js.map