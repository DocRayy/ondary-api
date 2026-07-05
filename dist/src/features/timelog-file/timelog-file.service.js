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
exports.TimelogFileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const media_url_util_1 = require("../../common/uploads/media-url.util");
const photo_upload_config_1 = require("../../common/uploads/photo-upload.config");
const entities_1 = require("../../database/entities");
let TimelogFileService = class TimelogFileService {
    timelogFileRepository;
    constructor(timelogFileRepository) {
        this.timelogFileRepository = timelogFileRepository;
    }
    async create(payload, photo) {
        const photoUrl = (0, photo_upload_config_1.uploadedPhotoUrl)('timelog-file', photo);
        const photoPath = (0, photo_upload_config_1.uploadedPhotoPath)('timelog-file', photo);
        const timelogFile = await this.timelogFileRepository.save(this.timelogFileRepository.create({
            ...payload,
            photo: photoUrl ?? payload.photo,
            file_url: photoUrl ?? payload.file_url,
            file_path: photoPath ?? payload.file_path,
        }));
        return (0, api_response_util_1.successResponse)('Timelog File Created', 'Timelog file created successfully', (0, api_response_util_1.responseData)(await this.findOne(timelogFile.id)));
    }
    findAll() {
        return this.timelogFileRepository
            .find({
            relations: { timelog: { user: true, taskTodo: { task: true } } },
            order: { id: 'DESC' },
        })
            .then((timelogFiles) => (0, api_response_util_1.successResponse)('Timelog Files Retrieved', 'Timelog files retrieved successfully', (0, media_url_util_1.withPhotoUrl)((0, remove_passwords_util_1.removePasswords)(timelogFiles))));
    }
    async findOne(id) {
        const timelogFile = await this.timelogFileRepository.findOne({
            where: { id },
            relations: { timelog: { user: true, taskTodo: { task: true } } },
        });
        if (!timelogFile) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Timelog File Not Found', `Timelog file ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Timelog File Retrieved', 'Timelog file retrieved successfully', (0, media_url_util_1.withPhotoUrl)((0, remove_passwords_util_1.removePasswords)(timelogFile)));
    }
    async update(id, payload, photo) {
        const photoUrl = (0, photo_upload_config_1.uploadedPhotoUrl)('timelog-file', photo);
        const photoPath = (0, photo_upload_config_1.uploadedPhotoPath)('timelog-file', photo);
        const timelogFile = await this.timelogFileRepository.preload({
            id,
            ...payload,
            ...(photoUrl ? { photo: photoUrl, file_url: photoUrl } : {}),
            ...(photoPath ? { file_path: photoPath } : {}),
        });
        if (!timelogFile) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Timelog File Not Found', `Timelog file ${id} was not found`));
        }
        const savedTimelogFile = await this.timelogFileRepository.save(timelogFile);
        return (0, api_response_util_1.successResponse)('Timelog File Updated', 'Timelog file updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTimelogFile.id)));
    }
    async remove(id) {
        const timelogFile = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.timelogFileRepository.remove(timelogFile);
        return (0, api_response_util_1.successResponse)('Timelog File Deleted', 'Timelog file deleted successfully');
    }
};
exports.TimelogFileService = TimelogFileService;
exports.TimelogFileService = TimelogFileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TimelogFileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TimelogFileService);
//# sourceMappingURL=timelog-file.service.js.map