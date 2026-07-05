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
exports.TaskCommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
const notification_service_1 = require("../notification/public/notification.service");
const realtime_service_1 = require("../realtime/realtime.service");
let TaskCommentsService = class TaskCommentsService {
    taskCommentsRepository;
    taskRepository;
    userRepository;
    notificationService;
    realtimeService;
    constructor(taskCommentsRepository, taskRepository, userRepository, notificationService, realtimeService) {
        this.taskCommentsRepository = taskCommentsRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.realtimeService = realtimeService;
    }
    findAll(query = {}) {
        return this.taskCommentsRepository
            .find({
            where: query.task_id ? { task_id: query.task_id } : undefined,
            relations: { user: true, task: true },
            order: { created_at: 'ASC', id: 'ASC' },
        })
            .then((comments) => (0, api_response_util_1.successResponse)('Task Comments Retrieved', 'Task comments retrieved successfully', (0, remove_passwords_util_1.removePasswords)(comments)));
    }
    async create(payload, userId) {
        const task = await this.findTask(payload.task_id);
        await this.findUser(userId);
        const comment = await this.taskCommentsRepository.save(this.taskCommentsRepository.create({
            task_id: payload.task_id,
            user_id: userId,
            message: payload.message,
        }));
        const commentWithUser = (0, api_response_util_1.responseData)(await this.findOne(comment.id));
        this.realtimeService.emitToProject(task.project_id, 'task.comment.created', {
            task_id: task.id,
            comment: commentWithUser,
        });
        await this.notifyMentionedUsers(payload.message, task, userId);
        return (0, api_response_util_1.successResponse)('Task Comment Created', 'Task comment created successfully', (0, remove_passwords_util_1.removePasswords)(commentWithUser));
    }
    async findOne(id) {
        const comment = await this.taskCommentsRepository.findOne({
            where: { id },
            relations: { user: true, task: true },
        });
        if (!comment) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Comment Not Found', `Task comment ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Comment Retrieved', 'Task comment retrieved successfully', (0, remove_passwords_util_1.removePasswords)(comment));
    }
    async update(id, payload) {
        const comment = await this.taskCommentsRepository.preload({
            id,
            ...payload,
        });
        if (!comment) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Comment Not Found', `Task comment ${id} was not found`));
        }
        const savedComment = await this.taskCommentsRepository.save(comment);
        const commentWithUser = (0, api_response_util_1.responseData)(await this.findOne(savedComment.id));
        this.realtimeService.emitToProject(commentWithUser.task.project_id, 'task.comment.updated', {
            task_id: savedComment.task_id,
            comment: commentWithUser,
        });
        return (0, api_response_util_1.successResponse)('Task Comment Updated', 'Task comment updated successfully', (0, remove_passwords_util_1.removePasswords)(commentWithUser));
    }
    async remove(id) {
        const comment = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskCommentsRepository.remove(comment);
        this.realtimeService.emitToProject(comment.task.project_id, 'task.comment.deleted', {
            task_id: comment.task_id,
            id: comment.id,
        });
        return (0, api_response_util_1.successResponse)('Task Comment Deleted', 'Task comment deleted successfully');
    }
    async notifyMentionedUsers(message, task, senderUserId) {
        const usernames = this.extractMentionedUsernames(message);
        if (!usernames.length) {
            return [];
        }
        const users = await this.userRepository.find({
            where: { username: (0, typeorm_2.In)(usernames) },
            select: { id: true, username: true },
        });
        const recipientIds = users
            .map((user) => user.id)
            .filter((userId) => userId !== senderUserId);
        return this.notificationService.createForTaskCommentMention(task, recipientIds);
    }
    extractMentionedUsernames(message) {
        return [
            ...new Set(Array.from(message.matchAll(/@([a-zA-Z0-9_.-]+)/g)).map((match) => match[1])),
        ];
    }
    async findTask(taskId) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Not Found', `Task ${taskId} was not found`));
        }
        return task;
    }
    async findUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('User Not Found', `User ${userId} was not found`));
        }
        return user;
    }
};
exports.TaskCommentsService = TaskCommentsService;
exports.TaskCommentsService = TaskCommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskCommentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.TaskEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        realtime_service_1.RealtimeService])
], TaskCommentsService);
//# sourceMappingURL=task-comments.service.js.map