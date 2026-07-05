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
exports.TaskFilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
let TaskFilesService = class TaskFilesService {
    taskFilesRepository;
    constructor(taskFilesRepository) {
        this.taskFilesRepository = taskFilesRepository;
    }
    async create(payload) {
        const taskFile = await this.taskFilesRepository.save(this.taskFilesRepository.create(payload));
        return (0, api_response_util_1.successResponse)('Task File Created', 'Task file created successfully', (0, api_response_util_1.responseData)(await this.findOne(taskFile.id)));
    }
    findAll() {
        return this.taskFilesRepository
            .find({ relations: { task: { user: true } }, order: { id: 'DESC' } })
            .then((taskFiles) => (0, api_response_util_1.successResponse)('Task Files Retrieved', 'Task files retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskFiles)));
    }
    async findOne(id) {
        const taskFile = await this.taskFilesRepository.findOne({
            where: { id },
            relations: { task: { user: true } },
        });
        if (!taskFile) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task File Not Found', `Task file ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task File Retrieved', 'Task file retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskFile));
    }
    async update(id, payload) {
        const taskFile = await this.taskFilesRepository.preload({ id, ...payload });
        if (!taskFile) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task File Not Found', `Task file ${id} was not found`));
        }
        const savedTaskFile = await this.taskFilesRepository.save(taskFile);
        return (0, api_response_util_1.successResponse)('Task File Updated', 'Task file updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTaskFile.id)));
    }
    async remove(id) {
        const taskFile = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskFilesRepository.remove(taskFile);
        return (0, api_response_util_1.successResponse)('Task File Deleted', 'Task file deleted successfully');
    }
};
exports.TaskFilesService = TaskFilesService;
exports.TaskFilesService = TaskFilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskFileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskFilesService);
//# sourceMappingURL=task-files.service.js.map