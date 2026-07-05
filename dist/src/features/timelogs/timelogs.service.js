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
exports.TimelogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
const realtime_service_1 = require("../realtime/realtime.service");
let TimelogsService = class TimelogsService {
    timelogsRepository;
    taskTodosRepository;
    taskRepository;
    realtimeService;
    warningSentKeys = new Set();
    monitorInterval;
    constructor(timelogsRepository, taskTodosRepository, taskRepository, realtimeService) {
        this.timelogsRepository = timelogsRepository;
        this.taskTodosRepository = taskTodosRepository;
        this.taskRepository = taskRepository;
        this.realtimeService = realtimeService;
    }
    onModuleInit() {
        this.monitorInterval = setInterval(() => {
            void this.emitEstimateAlerts();
        }, 60_000);
        void this.emitEstimateAlerts();
    }
    onModuleDestroy() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
    }
    async create(payload) {
        const timelog = await this.timelogsRepository.save(this.timelogsRepository.create(this.prepareCreatePayload(payload)));
        await this.syncProgressByTaskTodoId(timelog.task_todo_id);
        return (0, api_response_util_1.successResponse)('Timelog Created', 'Timelog created successfully', (0, api_response_util_1.responseData)(await this.findOne(timelog.id)));
    }
    findAll() {
        return this.timelogsRepository
            .find({
            relations: {
                user: true,
                taskTodo: {
                    task: { user: true },
                    user: true,
                    todoUsers: { user: true },
                },
                files: true,
            },
            order: { id: 'DESC' },
        })
            .then((timelogs) => (0, api_response_util_1.successResponse)('Timelogs Retrieved', 'Timelogs retrieved successfully', this.withTimelogFile((0, remove_passwords_util_1.removePasswords)(timelogs))));
    }
    async findOne(id) {
        const timelog = await this.timelogsRepository.findOne({
            where: { id },
            relations: {
                user: true,
                taskTodo: {
                    task: { user: true },
                    user: true,
                    todoUsers: { user: true },
                },
                files: true,
            },
        });
        if (!timelog) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Timelog Not Found', `Timelog ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Timelog Retrieved', 'Timelog retrieved successfully', this.withTimelogFile((0, remove_passwords_util_1.removePasswords)(timelog)));
    }
    async update(id, payload) {
        const currentTimelog = await this.timelogsRepository.findOne({
            where: { id },
        });
        if (!currentTimelog) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Timelog Not Found', `Timelog ${id} was not found`));
        }
        const timelog = this.timelogsRepository.merge(currentTimelog, this.prepareUpdatePayload(currentTimelog, payload));
        const savedTimelog = await this.timelogsRepository.save(timelog);
        await this.syncProgressByTaskTodoId(savedTimelog.task_todo_id);
        return (0, api_response_util_1.successResponse)('Timelog Updated', 'Timelog updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTimelog.id)));
    }
    async remove(id) {
        const timelog = await this.timelogsRepository.findOne({ where: { id } });
        if (!timelog) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Timelog Not Found', `Timelog ${id} was not found`));
        }
        const taskTodoId = timelog.task_todo_id;
        await this.timelogsRepository.remove(timelog);
        await this.syncProgressByTaskTodoId(taskTodoId);
        return (0, api_response_util_1.successResponse)('Timelog Deleted', 'Timelog deleted successfully');
    }
    prepareCreatePayload(payload) {
        const status = payload.status ?? (payload.end ? 'pause' : 'active');
        return this.applyStatusRules({
            ...payload,
            status,
        });
    }
    prepareUpdatePayload(currentTimelog, payload) {
        if (currentTimelog.status === 'finish' &&
            payload.status &&
            payload.status !== 'finish') {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Invalid Timelog Status', 'A finished timelog cannot be changed back to active or paused'));
        }
        const nextStatus = payload.status ??
            (currentTimelog.status === 'finish'
                ? 'finish'
                : payload.end
                    ? 'pause'
                    : currentTimelog.status);
        return this.applyStatusRules({
            ...payload,
            status: nextStatus,
        });
    }
    applyStatusRules(payload) {
        if (payload.status === 'active') {
            return {
                ...payload,
                start: payload.start ?? new Date().toISOString(),
                end: undefined,
            };
        }
        if (payload.status === 'pause' || payload.status === 'finish') {
            return {
                ...payload,
                end: payload.end ?? new Date().toISOString(),
            };
        }
        return payload;
    }
    async syncProgressByTaskTodoId(taskTodoId) {
        if (!taskTodoId) {
            return;
        }
        const taskTodo = await this.taskTodosRepository.findOne({
            where: { id: taskTodoId },
        });
        if (!taskTodo) {
            return;
        }
        const latestTimelog = await this.timelogsRepository.findOne({
            where: { task_todo_id: taskTodoId },
            order: { id: 'DESC' },
        });
        const todoStatus = this.getTodoStatusFromTimelog(latestTimelog, taskTodo);
        const todoProgress = this.getTodoProgress(todoStatus);
        await this.taskTodosRepository.update(taskTodoId, {
            status: todoStatus,
            progress: todoProgress,
        });
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
    getTodoStatusFromTimelog(timelog, taskTodo) {
        if (!timelog) {
            return 'draft';
        }
        if (timelog.status === 'finish') {
            if (taskTodo && this.isTimelogOverEstimate(timelog, taskTodo)) {
                return 'completed_but_overdue';
            }
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
    withTimelogFile(timelog) {
        if (Array.isArray(timelog)) {
            return timelog.map((item) => this.withTimelogFile(item));
        }
        return {
            ...timelog,
            timelog_file: timelog.files ?? [],
        };
    }
    async emitEstimateAlerts() {
        const activeTimelogs = await this.timelogsRepository.find({
            where: { status: 'active' },
            relations: { taskTodo: { task: true } },
        });
        const now = new Date();
        activeTimelogs.forEach((timelog) => {
            const taskTodo = timelog.taskTodo;
            if (!taskTodo?.estimate_time || !timelog.start) {
                return;
            }
            const estimateMinutes = taskTodo.estimate_time * 60;
            const elapsedMs = now.getTime() - new Date(timelog.start).getTime();
            const elapsedMinutes = Math.floor(elapsedMs / 60_000);
            const remainingMinutes = estimateMinutes - elapsedMinutes;
            const basePayload = {
                timelog_id: timelog.id,
                user_id: timelog.user_id,
                task_todo_id: taskTodo.id,
                task_id: taskTodo.task_id,
                task_title: taskTodo.task?.title ?? null,
                todo_label: taskTodo.label,
                estimate_time: taskTodo.estimate_time,
                estimate_time_minutes: estimateMinutes,
                estimate_time_label: this.formatEstimateTime(taskTodo.estimate_time),
                elapsed_minutes: elapsedMinutes,
            };
            if (elapsedMs > estimateMinutes * 60_000) {
                this.realtimeService.emitToUser(timelog.user_id, 'task_todo.overdue', {
                    ...basePayload,
                    title: 'Task Todo Overdue',
                    message: `Todo "${taskTodo.label}" sudah melewati estimate time.`,
                    overdue_minutes: elapsedMinutes - estimateMinutes,
                });
                return;
            }
            const warningKey = `${timelog.id}:10m`;
            if (remainingMinutes <= 10 &&
                remainingMinutes > 0 &&
                !this.warningSentKeys.has(warningKey)) {
                this.warningSentKeys.add(warningKey);
                this.realtimeService.emitToUser(timelog.user_id, 'task_todo.overdue_warning', {
                    ...basePayload,
                    title: 'Task Todo Almost Overdue',
                    message: `Todo "${taskTodo.label}" akan overdue dalam ${remainingMinutes} menit.`,
                    remaining_minutes: remainingMinutes,
                });
            }
        });
    }
    isTimelogOverEstimate(timelog, taskTodo) {
        if (!taskTodo.estimate_time || !timelog.start) {
            return false;
        }
        const end = timelog.end ? new Date(timelog.end) : new Date();
        const elapsedMs = end.getTime() - new Date(timelog.start).getTime();
        return elapsedMs > taskTodo.estimate_time * 60 * 60_000;
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
};
exports.TimelogsService = TimelogsService;
exports.TimelogsService = TimelogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TimelogEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.TaskTodoEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.TaskEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_service_1.RealtimeService])
], TimelogsService);
//# sourceMappingURL=timelogs.service.js.map