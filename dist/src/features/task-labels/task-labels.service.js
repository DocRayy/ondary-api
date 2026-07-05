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
exports.TaskLabelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const entities_1 = require("../../database/entities");
let TaskLabelsService = class TaskLabelsService {
    taskLabelsRepository;
    constructor(taskLabelsRepository) {
        this.taskLabelsRepository = taskLabelsRepository;
    }
    async create(payload) {
        const taskLabel = await this.taskLabelsRepository.save(this.taskLabelsRepository.create(payload));
        return (0, api_response_util_1.successResponse)('Task Label Created', 'Task label created successfully', taskLabel);
    }
    findAll() {
        return this.taskLabelsRepository
            .find()
            .then((taskLabels) => (0, api_response_util_1.successResponse)('Task Labels Retrieved', 'Task labels retrieved successfully', taskLabels));
    }
    async findOne(id) {
        const taskLabel = await this.taskLabelsRepository.findOne({
            where: { id },
        });
        if (!taskLabel) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Label Not Found', `Task label ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Label Retrieved', 'Task label retrieved successfully', taskLabel);
    }
    async update(id, payload) {
        const taskLabel = await this.taskLabelsRepository.preload({
            id,
            ...payload,
        });
        if (!taskLabel) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Label Not Found', `Task label ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Label Updated', 'Task label updated successfully', await this.taskLabelsRepository.save(taskLabel));
    }
    async remove(id) {
        const taskLabel = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskLabelsRepository.remove(taskLabel);
        return (0, api_response_util_1.successResponse)('Task Label Deleted', 'Task label deleted successfully');
    }
};
exports.TaskLabelsService = TaskLabelsService;
exports.TaskLabelsService = TaskLabelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskLabelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskLabelsService);
//# sourceMappingURL=task-labels.service.js.map