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
exports.NotificationService = exports.TASK_STATUS_UPDATED_EVENT = exports.TASK_CREATED_EVENT = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../../common/serialization/remove-passwords.util");
const entities_1 = require("../../../database/entities");
const notification_entity_1 = require("../entities/notification.entity");
const realtime_service_1 = require("../../realtime/realtime.service");
exports.TASK_CREATED_EVENT = 'task.created';
exports.TASK_STATUS_UPDATED_EVENT = 'task.status.updated';
let NotificationService = class NotificationService {
    notificationRepository;
    taskRepository;
    userRepository;
    realtimeService;
    constructor(notificationRepository, taskRepository, userRepository, realtimeService) {
        this.notificationRepository = notificationRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.realtimeService = realtimeService;
    }
    async create(payload) {
        const task = await this.findTask(payload.task_id);
        return (0, api_response_util_1.successResponse)('Notification Created', 'Notification created successfully', await this.createForTaskStatus(task, {
            title: payload.title,
            message: payload.message,
        }));
    }
    findAll(user) {
        if (this.canReadAll(user)) {
            return this.notificationRepository
                .find({
                relations: {
                    task: { user: true },
                    taskTodo: { user: true },
                    managerNote: true,
                    user: true,
                },
                order: { created_at: 'DESC' },
            })
                .then((notifications) => (0, api_response_util_1.successResponse)('Notifications Retrieved', 'Notifications retrieved successfully', (0, remove_passwords_util_1.removePasswords)(notifications)));
        }
        return this.notificationRepository
            .find({
            where: { user_id: user.id },
            relations: {
                task: { user: true },
                taskTodo: { user: true },
                managerNote: true,
                user: true,
            },
            order: { created_at: 'DESC' },
        })
            .then((notifications) => (0, api_response_util_1.successResponse)('Notifications Retrieved', 'Notifications retrieved successfully', (0, remove_passwords_util_1.removePasswords)(notifications)));
    }
    async createForTaskTodoCreated(taskTodo, task, recipientIds) {
        const todoRecipientIds = recipientIds?.length
            ? recipientIds
            : taskTodo.user_id
                ? [taskTodo.user_id]
                : [];
        if (todoRecipientIds.length === 0) {
            return [];
        }
        return this.createForUsers(todoRecipientIds, {
            type: 'task_todo_created',
            task_id: task.id,
            task_todo_id: taskTodo.id,
            title: 'New Task Todo',
            message: `Todo "${taskTodo.label}" was added to task "${task.title}".`,
        });
    }
    async createForManagerNoteCreated(managerNote) {
        return this.createForUsers([managerNote.user_id], {
            type: 'manager_note_created',
            manager_note_id: managerNote.id,
            title: 'New Manager Note',
            message: `Manager note "${managerNote.title}" was created for you.`,
        });
    }
    async createForTaskCommentMention(task, recipientIds) {
        return this.createForUsers(recipientIds, {
            type: 'task_comment_mention',
            task_id: task.id,
            title: 'Task Comment Mention',
            message: `You were mentioned in a comment on task "${task.title}".`,
        });
    }
    findMine(user) {
        return this.notificationRepository
            .find({
            where: { user_id: user.id },
            relations: {
                task: { user: true },
                taskTodo: { user: true },
                managerNote: true,
                user: true,
            },
            order: { created_at: 'DESC' },
        })
            .then((notifications) => (0, api_response_util_1.successResponse)('Notifications Retrieved', 'Notifications retrieved successfully', (0, remove_passwords_util_1.removePasswords)(notifications)));
    }
    async findOne(id, user) {
        const notification = await this.notificationRepository.findOne({
            where: this.canReadAll(user) ? { id } : { id, user_id: user.id },
            relations: {
                task: { user: true },
                taskTodo: { user: true },
                managerNote: true,
                user: true,
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Notification Not Found', `Notification ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Notification Retrieved', 'Notification retrieved successfully', (0, remove_passwords_util_1.removePasswords)(notification));
    }
    async markAsRead(id, user) {
        const notification = (0, api_response_util_1.responseData)(await this.findOne(id, user));
        notification.is_read = true;
        return (0, api_response_util_1.successResponse)('Notification Updated', 'Notification marked as read successfully', await this.notificationRepository.save(notification));
    }
    async handleTaskCreated(payload) {
        const task = await this.findTask(payload.task_id);
        return this.createForTaskStatus(task, {
            type: 'task_created',
            title: 'New Task',
            message: `Task "${task.title}" created with status ${task.status}.`,
        });
    }
    async handleTaskStatusUpdated(payload) {
        const task = await this.findTask(payload.task_id);
        return this.createForTaskStatus(task, {
            title: 'Task Status Updated',
            message: `Task "${task.title}" status changed from ${payload.previous_status} to ${payload.current_status}.`,
        });
    }
    async findTask(taskId) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Not Found', `Task ${taskId} was not found`));
        }
        return task;
    }
    async createForTaskStatus(task, override) {
        const recipientIds = await this.getTaskRecipientIds(task);
        if (recipientIds.length === 0) {
            return [];
        }
        return this.createForUsers(recipientIds, {
            type: override?.type ?? 'task_status_updated',
            task_id: task.id,
            title: override?.title ?? 'Task Status Updated',
            message: override?.message ??
                `Task "${task.title}" is currently ${task.status}.`,
        });
    }
    async createForUsers(recipientIds, payload) {
        const uniqueRecipientIds = [
            ...new Set(recipientIds.filter((userId) => Number.isInteger(userId) && userId > 0)),
        ];
        if (uniqueRecipientIds.length === 0) {
            return [];
        }
        const users = await this.userRepository.find({
            where: { id: (0, typeorm_2.In)(uniqueRecipientIds) },
            select: { id: true },
        });
        const notifications = users.map((user) => this.notificationRepository.create({
            task_id: payload.task_id ?? null,
            task_todo_id: payload.task_todo_id ?? null,
            manager_note_id: payload.manager_note_id ?? null,
            user_id: user.id,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            is_read: false,
        }));
        const savedNotifications = await this.notificationRepository.save(notifications);
        savedNotifications.forEach((notification) => {
            this.realtimeService.emitToUser(notification.user_id, 'notification.created', (0, remove_passwords_util_1.removePasswords)(notification));
        });
        return savedNotifications;
    }
    getTaskRecipientIds(task) {
        return [
            ...new Set([task.user_id, ...(task.assignee_user_ids ?? [])]),
        ].filter((userId) => Number.isInteger(userId) && userId > 0);
    }
    canReadAll(user) {
        return user.role === 'admin' || user.role === 'manager';
    }
};
exports.NotificationService = NotificationService;
__decorate([
    (0, event_emitter_1.OnEvent)(exports.TASK_CREATED_EVENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "handleTaskCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(exports.TASK_STATUS_UPDATED_EVENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "handleTaskStatusUpdated", null);
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.TaskEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_service_1.RealtimeService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map