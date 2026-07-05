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
exports.TaskLabelMapsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
let TaskLabelMapsService = class TaskLabelMapsService {
    taskLabelMapsRepository;
    constructor(taskLabelMapsRepository) {
        this.taskLabelMapsRepository = taskLabelMapsRepository;
    }
    async create(payload) {
        const taskLabelMap = await this.taskLabelMapsRepository.save(this.taskLabelMapsRepository.create(payload));
        return (0, api_response_util_1.successResponse)('Task Label Map Created', 'Task label map created successfully', (0, api_response_util_1.responseData)(await this.findOne(taskLabelMap)));
    }
    findAll() {
        return this.taskLabelMapsRepository
            .find({
            relations: { task: { user: true }, taskLabel: true },
            order: { created_at: 'DESC' },
        })
            .then((taskLabelMaps) => (0, api_response_util_1.successResponse)('Task Label Maps Retrieved', 'Task label maps retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskLabelMaps)));
    }
    async findOne(params) {
        const taskLabelMap = await this.taskLabelMapsRepository.findOne({
            where: {
                task_id: params.task_id,
                task_label_id: params.task_label_id,
            },
            relations: { task: { user: true }, taskLabel: true },
        });
        if (!taskLabelMap) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Label Map Not Found', 'Task label map was not found'));
        }
        return (0, api_response_util_1.successResponse)('Task Label Map Retrieved', 'Task label map retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskLabelMap));
    }
    async update(params, payload) {
        await this.findOne(params);
        const savedTaskLabelMap = await this.taskLabelMapsRepository.save({
            ...params,
            ...payload,
        });
        return (0, api_response_util_1.successResponse)('Task Label Map Updated', 'Task label map updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTaskLabelMap)));
    }
    async remove(params) {
        const taskLabelMap = (0, api_response_util_1.responseData)(await this.findOne(params));
        await this.taskLabelMapsRepository.remove(taskLabelMap);
        return (0, api_response_util_1.successResponse)('Task Label Map Deleted', 'Task label map deleted successfully');
    }
};
exports.TaskLabelMapsService = TaskLabelMapsService;
exports.TaskLabelMapsService = TaskLabelMapsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskLabelMapEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskLabelMapsService);
//# sourceMappingURL=task-label-maps.service.js.map