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
exports.TaskBookmarksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
let TaskBookmarksService = class TaskBookmarksService {
    taskBookmarksRepository;
    constructor(taskBookmarksRepository) {
        this.taskBookmarksRepository = taskBookmarksRepository;
    }
    async create(payload) {
        const taskBookmark = await this.taskBookmarksRepository.save(this.taskBookmarksRepository.create(payload));
        return (0, api_response_util_1.successResponse)('Task Bookmark Created', 'Task bookmark created successfully', (0, api_response_util_1.responseData)(await this.findOne(taskBookmark.id)));
    }
    findAll() {
        return this.taskBookmarksRepository
            .find({
            relations: { task: { user: true }, user: true },
            order: { id: 'DESC' },
        })
            .then((taskBookmarks) => (0, api_response_util_1.successResponse)('Task Bookmarks Retrieved', 'Task bookmarks retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskBookmarks)));
    }
    async findOne(id) {
        const taskBookmark = await this.taskBookmarksRepository.findOne({
            where: { id },
            relations: { task: { user: true }, user: true },
        });
        if (!taskBookmark) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Bookmark Not Found', `Task bookmark ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Task Bookmark Retrieved', 'Task bookmark retrieved successfully', (0, remove_passwords_util_1.removePasswords)(taskBookmark));
    }
    async update(id, payload) {
        const taskBookmark = await this.taskBookmarksRepository.preload({
            id,
            ...payload,
        });
        if (!taskBookmark) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Task Bookmark Not Found', `Task bookmark ${id} was not found`));
        }
        const savedTaskBookmark = await this.taskBookmarksRepository.save(taskBookmark);
        return (0, api_response_util_1.successResponse)('Task Bookmark Updated', 'Task bookmark updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedTaskBookmark.id)));
    }
    async remove(id) {
        const taskBookmark = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.taskBookmarksRepository.remove(taskBookmark);
        return (0, api_response_util_1.successResponse)('Task Bookmark Deleted', 'Task bookmark deleted successfully');
    }
};
exports.TaskBookmarksService = TaskBookmarksService;
exports.TaskBookmarksService = TaskBookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.TaskBookmarkEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskBookmarksService);
//# sourceMappingURL=task-bookmarks.service.js.map