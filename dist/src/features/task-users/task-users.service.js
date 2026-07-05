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
exports.TaskUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
const realtime_service_1 = require("../realtime/realtime.service");
let TaskUsersService = class TaskUsersService {
    taskUsersRepository;
    realtimeService;
    constructor(taskUsersRepository, realtimeService) {
        this.taskUsersRepository = taskUsersRepository;
        this.realtimeService = realtimeService;
    }
    async create(payload) {
        const taskUser = await this.taskUsersRepository.save(this.taskUsersRepository.create(payload));
        this.realtimeService.emitToUser(taskUser.user_id, 'notification.created', {
            type: 'task.assigned',
            task_id: taskUser.task_id,
            user_id: taskUser.user_id,
        });
        return (0, api_response_util_1.successResponse)('Task User Created', 'Task user created successfully', (0, api_response_util_1.responseData)(await this.findOne(taskUser.id)));
    }
    findAll() {
        return this.taskUsersRepository
            .find({
            relations: { task: { user: true }, user: true },
            order: { id: 'DESC' },
        })
            .then((taskUsers) => (0, api_response_util_1.successResponse)('Task Users Retrieved', 'Task users retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskUsers)));
    }
    async findOne(id) {
        const taskUser = await this.taskUsersRepository.findOne({
            where: { id },
            relations: { task: { user: true }, user: true },
        });
        if (!taskUser) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task User Not Found', `Task user ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task User Retrieved', 'Task user retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskUser));
    }
    async update(id, payload) {
        const taskUser = await this.taskUsersRepository.preload({ id, ...payload });
        if (!taskUser) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task User Not Found', `Task user ${id} was not found`));
        }
        const savedTaskUser = await this.taskUsersRepository.save(taskUser);
        return (0, api_response_util_1.successResponse)('Task User Updated', 'Task user updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTaskUser.id)));
    }
    async remove(id) {
        const taskUser = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskUsersRepository.remove(taskUser);
        return (0, api_response_util_1.successResponse)('Task User Deleted', 'Task user deleted successfully');
    }
};
exports.TaskUsersService = TaskUsersService;
exports.TaskUsersService = TaskUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskUserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        realtime_service_1.RealtimeService])
], TaskUsersService);
//# sourceMappingURL=task-users.service.js.map