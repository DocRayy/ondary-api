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
exports.TaskAttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const media_url_util_1 = require("../../common/uploads/media-url.util");
const photo_upload_config_1 = require("../../common/uploads/photo-upload.config");
const entities_1 = require("../../database/entities");
let TaskAttachmentsService = class TaskAttachmentsService {
    taskAttachmentsRepository;
    taskRepository;
    constructor(taskAttachmentsRepository, taskRepository) {
        this.taskAttachmentsRepository = taskAttachmentsRepository;
        this.taskRepository = taskRepository;
    }
    async create(payload, files) {
        await this.findTask(payload.task_id);
        if (!files.length) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Attachment Required', 'At least one file is required'));
        }
        const attachments = await this.taskAttachmentsRepository.save(files.map((file) => this.taskAttachmentsRepository.create({
            task_id: payload.task_id,
            files: (0, photo_upload_config_1.uploadedFileUrl)('task-attachments', file) ?? '',
            file_path: (0, photo_upload_config_1.uploadedFilePath)('task-attachments', file) ?? null,
            original_name: file.originalname ?? null,
            mime_type: file.mimetype ?? null,
            size: file.size ?? null,
        })));
        return (0, api_response_util_1.successResponse)('Task Attachments Created', 'Task attachments created successfully', this.withFileUrls((0, remove_passwords_util_1.removePasswords)(await this.taskAttachmentsRepository.find({
            where: attachments.map((attachment) => ({ id: attachment.id })),
            relations: { task: true },
            order: { id: 'DESC' },
        }))));
    }
    findAll(taskId) {
        return this.taskAttachmentsRepository
            .find({
            where: taskId ? { task_id: taskId } : undefined,
            relations: { task: true },
            order: { id: 'DESC' },
        })
            .then((attachments) => (0, api_response_util_1.successResponse)('Task Attachments Retrieved', 'Task attachments retrieved successfully', this.withFileUrls((0, remove_passwords_util_1.removePasswords)(attachments))));
    }
    async findOne(id) {
        const attachment = await this.taskAttachmentsRepository.findOne({
            where: { id },
            relations: { task: true },
        });
        if (!attachment) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Attachment Not Found', `Task attachment ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Attachment Retrieved', 'Task attachment retrieved successfully', this.withFileUrls((0, remove_passwords_util_1.removePasswords)(attachment)));
    }
    async update(id, payload) {
        if (payload.task_id) {
            await this.findTask(payload.task_id);
        }
        const attachment = await this.taskAttachmentsRepository.preload({
            id,
            ...payload,
        });
        if (!attachment) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Attachment Not Found', `Task attachment ${id} was not found`));
        }
        const savedAttachment = await this.taskAttachmentsRepository.save(attachment);
        return (0, api_response_util_1.successResponse)('Task Attachment Updated', 'Task attachment updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedAttachment.id)));
    }
    async remove(id) {
        const attachment = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskAttachmentsRepository.remove(attachment);
        return (0, api_response_util_1.successResponse)('Task Attachment Deleted', 'Task attachment deleted successfully');
    }
    withFileUrls(attachmentOrAttachments) {
        if (Array.isArray(attachmentOrAttachments)) {
            return attachmentOrAttachments.map((attachment) => this.withFileUrls(attachment));
        }
        return {
            ...attachmentOrAttachments,
            file_url: (0, media_url_util_1.publicMediaUrl)(attachmentOrAttachments.files),
            file_path_url: (0, media_url_util_1.publicMediaUrl)(attachmentOrAttachments.file_path),
        };
    }
    async findTask(taskId) {
        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Not Found', `Task ${taskId} was not found`));
        }
        return task;
    }
};
exports.TaskAttachmentsService = TaskAttachmentsService;
exports.TaskAttachmentsService = TaskAttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskAttachmentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.TaskEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TaskAttachmentsService);
//# sourceMappingURL=task-attachments.service.js.map