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
exports.TaskTodoFilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
let TaskTodoFilesService = class TaskTodoFilesService {
    taskTodoFilesRepository;
    constructor(taskTodoFilesRepository) {
        this.taskTodoFilesRepository = taskTodoFilesRepository;
    }
    async create(payload) {
        const taskTodoFile = await this.taskTodoFilesRepository.save(this.taskTodoFilesRepository.create(payload));
        return (0, api_response_util_1.successResponse)('Task Todo File Created', 'Task todo file created successfully', (0, api_response_util_1.responseData)(await this.findOne(taskTodoFile.id)));
    }
    findAll() {
        return this.taskTodoFilesRepository
            .find({
            relations: { taskTodo: { task: { user: true }, user: true } },
            order: { id: 'DESC' },
        })
            .then((taskTodoFiles) => (0, api_response_util_1.successResponse)('Task Todo Files Retrieved', 'Task todo files retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskTodoFiles)));
    }
    async findOne(id) {
        const taskTodoFile = await this.taskTodoFilesRepository.findOne({
            where: { id },
            relations: { taskTodo: { task: { user: true }, user: true } },
        });
        if (!taskTodoFile) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Todo File Not Found', `Task todo file ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Todo File Retrieved', 'Task todo file retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskTodoFile));
    }
    async update(id, payload) {
        const taskTodoFile = await this.taskTodoFilesRepository.preload({
            id,
            ...payload,
        });
        if (!taskTodoFile) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Todo File Not Found', `Task todo file ${id} was not found`));
        }
        const savedTaskTodoFile = await this.taskTodoFilesRepository.save(taskTodoFile);
        return (0, api_response_util_1.successResponse)('Task Todo File Updated', 'Task todo file updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTaskTodoFile.id)));
    }
    async remove(id) {
        const taskTodoFile = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskTodoFilesRepository.remove(taskTodoFile);
        return (0, api_response_util_1.successResponse)('Task Todo File Deleted', 'Task todo file deleted successfully');
    }
};
exports.TaskTodoFilesService = TaskTodoFilesService;
exports.TaskTodoFilesService = TaskTodoFilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskTodoFileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskTodoFilesService);
//# sourceMappingURL=task-todo-files.service.js.map