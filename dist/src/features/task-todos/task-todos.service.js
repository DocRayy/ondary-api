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
exports.TaskTodosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
const notification_service_1 = require("../notification/public/notification.service");
const realtime_service_1 = require("../realtime/realtime.service");
let TaskTodosService = class TaskTodosService {
    taskTodosRepository;
    taskTodoUsersRepository;
    taskRepository;
    userRepository;
    realtimeService;
    notificationService;
    constructor(taskTodosRepository, taskTodoUsersRepository, taskRepository, userRepository, realtimeService, notificationService) {
        this.taskTodosRepository = taskTodosRepository;
        this.taskTodoUsersRepository = taskTodoUsersRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.realtimeService = realtimeService;
        this.notificationService = notificationService;
    }
    async create(payload) {
        const task = await this.getTaskOrFail(payload.task_id);
        await this.requireManagerForManagerFields(payload, payload.created_by);
        const assignedUserIds = this.getRequestedTodoUserIds(payload);
        this.validateTodoUserAssignees(task, assignedUserIds);
        const { user_ids: _userIds, ...todoPayload } = payload;
        const taskTodo = await this.taskTodosRepository.save(this.taskTodosRepository.create({
            ...todoPayload,
            user_id: assignedUserIds[0] ?? payload.user_id ?? null,
            status: 'draft',
            progress: 0,
            created_by: payload.created_by ?? assignedUserIds[0] ?? payload.user_id ?? null,
        }));
        await this.syncTodoUsers(taskTodo.id, assignedUserIds);
        if (!task.task_todo_id) {
            await this.taskRepository.update(task.id, { task_todo_id: taskTodo.id });
        }
        await this.syncTaskProgress(taskTodo.task_id);
        await this.notificationService.createForTaskTodoCreated(taskTodo, task, assignedUserIds);
        return (0, api_response_util_1.successResponse)('Task Todo Created', 'Task todo created successfully', (0, api_response_util_1.responseData)(await this.findOne(taskTodo.id)));
    }
    findAll() {
        return this.taskTodosRepository
            .find({
            relations: this.taskTodoRelations(),
            order: { id: 'DESC' },
        })
            .then((taskTodos) => (0, api_response_util_1.successResponse)('Task Todos Retrieved', 'Task todos retrieved successfully', this.withTodoPresentation((0, remove_passwords_util_1.removePasswords)(taskTodos))));
    }
    async findOne(id) {
        const taskTodo = await this.taskTodosRepository.findOne({
            where: { id },
            relations: this.taskTodoRelations(),
        });
        if (!taskTodo) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Todo Not Found', `Task todo ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Todo Retrieved', 'Task todo retrieved successfully', this.withTodoPresentation((0, remove_passwords_util_1.removePasswords)(taskTodo)));
    }
    async update(id, payload) {
        await this.requireManagerForManagerFields(payload, payload.updated_by, true);
        const currentTaskTodo = await this.taskTodosRepository.findOne({
            where: { id },
            relations: { todoUsers: true },
        });
        if (!currentTaskTodo) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Todo Not Found', `Task todo ${id} was not found`));
        }
        const assignedUserIds = this.getRequestedTodoUserIds(payload, currentTaskTodo);
        const { user_ids: _userIds, ...todoPayload } = payload;
        const taskTodo = await this.taskTodosRepository.preload({
            id,
            ...todoPayload,
            user_id: payload.user_ids !== undefined
                ? (assignedUserIds[0] ?? null)
                : (payload.user_id ?? currentTaskTodo.user_id),
        });
        if (!taskTodo) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Todo Not Found', `Task todo ${id} was not found`));
        }
        const task = await this.getTaskOrFail(taskTodo.task_id);
        this.validateTodoUserAssignees(task, assignedUserIds);
        const savedTaskTodo = await this.taskTodosRepository.save(taskTodo);
        if (payload.user_ids !== undefined || payload.user_id !== undefined) {
            await this.syncTodoUsers(savedTaskTodo.id, assignedUserIds);
        }
        await this.syncTaskTodoProgress(savedTaskTodo.id);
        this.realtimeService.emitToProject(task.project_id, 'todo.updated', {
            todo: savedTaskTodo,
        });
        return (0, api_response_util_1.successResponse)('Task Todo Updated', 'Task todo updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTaskTodo.id)));
    }
    async remove(id) {
        const taskTodo = await this.taskTodosRepository.findOne({ where: { id } });
        if (!taskTodo) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Todo Not Found', `Task todo ${id} was not found`));
        }
        const taskId = taskTodo.task_id;
        await this.taskTodosRepository.remove(taskTodo);
        await this.syncTaskProgress(taskId);
        return (0, api_response_util_1.successResponse)('Task Todo Deleted', 'Task todo deleted successfully');
    }
    async syncTaskTodoProgress(taskTodoId) {
        const taskTodo = await this.taskTodosRepository.findOne({
            where: { id: taskTodoId },
            relations: { timelogs: true },
        });
        if (!taskTodo) {
            return;
        }
        const latestTimelog = [...(taskTodo.timelogs ?? [])].sort((first, second) => second.id - first.id)[0];
        const status = this.getTodoStatusFromTimelog(latestTimelog);
        const progress = this.getTodoProgress(status);
        await this.taskTodosRepository.update(taskTodoId, { status, progress });
        await this.syncTaskProgress(taskTodo.task_id);
    }
    async syncTaskProgress(taskId) {
        const todos = await this.taskTodosRepository.find({
            where: { task_id: taskId },
            select: { progress: true },
        });
        const progress = todos.length === 0
            ? 0
            : Math.round(todos.reduce((total, todo) => total + (todo.progress ?? 0), 0) /
                todos.length);
        await this.taskRepository.update(taskId, { progress });
    }
    getTodoStatusFromTimelog(timelog) {
        if (!timelog) {
            return 'draft';
        }
        if (timelog.status === 'finish') {
            return 'complete';
        }
        if (timelog.status === 'pause') {
            return 'break';
        }
        return 'pending';
    }
    getTodoProgress(status) {
        if (status === 'complete' || status === 'completed_but_overdue') {
            return 100;
        }
        if (status === 'break') {
            return 50;
        }
        return 0;
    }
    async getTaskOrFail(taskId) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Not Found', `Task ${taskId} was not found`));
        }
        return task;
    }
    validateTodoUserAssignees(task, userIds) {
        if (userIds.length === 0) {
            return;
        }
        const allowedUserIds = new Set([
            task.user_id,
            ...this.normalizeUserIds(task.assignee_user_ids),
        ]);
        const invalidUserId = userIds.find((userId) => !allowedUserIds.has(userId));
        if (invalidUserId) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Invalid Task Todo Assignee', `User ${invalidUserId} is not assigned to task ${task.id}`));
        }
    }
    async requireManagerForManagerFields(payload, actorId, isUpdate = false) {
        const hasManagerOnlyField = payload.estimate_time !== undefined ||
            payload.user_ids !== undefined ||
            (isUpdate && payload.user_id !== undefined);
        if (!hasManagerOnlyField) {
            return;
        }
        if (!actorId) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Manager Required', 'created_by or updated_by is required to change todo estimate time or assignees'));
        }
        const actor = await this.userRepository.findOne({ where: { id: actorId } });
        if (!actor || (actor.role !== 'manager' && actor.role !== 'admin')) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Manager Required', 'Only manager can change todo estimate time or assignees'));
        }
    }
    getRequestedTodoUserIds(payload, currentTaskTodo) {
        if (payload.user_ids !== undefined) {
            return this.normalizeUserIds(payload.user_ids);
        }
        if (payload.user_id !== undefined) {
            return this.normalizeUserIds([payload.user_id]);
        }
        if (currentTaskTodo?.todoUsers?.length) {
            return this.normalizeUserIds(currentTaskTodo.todoUsers.map((assignment) => assignment.user_id));
        }
        return this.normalizeUserIds(currentTaskTodo?.user_id ?? null);
    }
    async syncTodoUsers(taskTodoId, userIds) {
        await this.taskTodoUsersRepository.delete({ task_todo_id: taskTodoId });
        const uniqueUserIds = this.normalizeUserIds(userIds);
        if (uniqueUserIds.length === 0) {
            return;
        }
        await this.taskTodoUsersRepository.save(uniqueUserIds.map((userId) => this.taskTodoUsersRepository.create({
            task_todo_id: taskTodoId,
            user_id: userId,
        })));
    }
    taskTodoRelations() {
        return {
            task: { user: true, createdBy: true, updatedBy: true },
            user: true,
            todoUsers: { user: true },
            createdBy: true,
            updatedBy: true,
            timelogs: { user: true },
        };
    }
    withTodoPresentation(todo) {
        if (Array.isArray(todo)) {
            return todo.map((item) => this.withTodoPresentation(item));
        }
        const users = todo.todoUsers
            ?.map((assignment) => assignment.user)
            .filter((user) => Boolean(user)) ??
            (todo.user ? [todo.user] : []);
        const userIds = users.map((user) => user.id);
        return {
            ...todo,
            users,
            user_ids: userIds,
            estimate_time_hours: todo.estimate_time,
            estimate_time_minutes: todo.estimate_time === null || todo.estimate_time === undefined
                ? null
                : todo.estimate_time * 60,
            estimate_time_label: this.formatEstimateTime(todo.estimate_time),
        };
    }
    formatEstimateTime(hours) {
        if (hours === null || hours === undefined) {
            return null;
        }
        const days = Math.floor(hours / 8);
        const remainingHours = hours % 8;
        const parts = [];
        if (days > 0) {
            parts.push(`${days}d`);
        }
        if (remainingHours > 0 || parts.length === 0) {
            parts.push(`${remainingHours}h`);
        }
        return parts.join(' ');
    }
    normalizeUserIds(value) {
        if (!value) {
            return [];
        }
        const parsedValue = typeof value === 'string' ? this.parseUserIds(value) : value;
        if (!Array.isArray(parsedValue)) {
            return [];
        }
        return [
            ...new Set(parsedValue
                .map((userId) => Number(userId))
                .filter((userId) => Number.isInteger(userId) && userId > 0)),
        ];
    }
    parseUserIds(value) {
        try {
            return JSON.parse(value);
        }
        catch {
            return value.split(',');
        }
    }
};
exports.TaskTodosService = TaskTodosService;
exports.TaskTodosService = TaskTodosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskTodoEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.TaskTodoUserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.TaskEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_service_1.RealtimeService,
        notification_service_1.NotificationService])
], TaskTodosService);
//# sourceMappingURL=task-todos.service.js.map