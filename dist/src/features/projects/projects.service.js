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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const media_url_util_1 = require("../../common/uploads/media-url.util");
const photo_upload_config_1 = require("../../common/uploads/photo-upload.config");
const entities_1 = require("../../database/entities");
let ProjectsService = class ProjectsService {
    projectsRepository;
    constructor(projectsRepository) {
        this.projectsRepository = projectsRepository;
    }
    async create(payload, photo) {
        const project = await this.projectsRepository.save(this.projectsRepository.create({
            ...payload,
            photo: (0, photo_upload_config_1.uploadedPhotoUrl)('projects', photo) ?? payload.photo,
        }));
        return (0, api_response_util_1.successResponse)('Project Created', 'Project created successfully', (0, api_response_util_1.responseData)(await this.findOne(project.id)));
    }
    findAll() {
        return this.projectsRepository
            .find({
            relations: {
                user: true,
                tasks: { user: true, createdBy: true, updatedBy: true },
            },
            order: { id: 'DESC' },
        })
            .then((projects) => (0, api_response_util_1.successResponse)('Projects Retrieved', 'Projects retrieved successfully', (0, media_url_util_1.withPhotoUrl)(this.withTaskIds((0, remove_passwords_util_1.removePasswords)(projects)))));
    }
    async findOne(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: {
                user: true,
                tasks: { user: true, createdBy: true, updatedBy: true },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Project Not Found', `Project ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Project Retrieved', 'Project retrieved successfully', (0, media_url_util_1.withPhotoUrl)(this.withTaskIds((0, remove_passwords_util_1.removePasswords)(project))));
    }
    async update(id, payload, photo) {
        const project = await this.projectsRepository.preload({
            id,
            ...payload,
            ...(photo ? { photo: (0, photo_upload_config_1.uploadedPhotoUrl)('projects', photo) } : {}),
        });
        if (!project) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Project Not Found', `Project ${id} was not found`));
        }
        const savedProject = await this.projectsRepository.save(project);
        return (0, api_response_util_1.successResponse)('Project Updated', 'Project updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedProject.id)));
    }
    async remove(id) {
        const project = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.projectsRepository.remove(project);
        return (0, api_response_util_1.successResponse)('Project Deleted', 'Project deleted successfully');
    }
    withTaskIds(project) {
        if (Array.isArray(project)) {
            return project.map((item) => this.withTaskIds(item));
        }
        return {
            ...project,
            task_id: project.tasks?.map((task) => task.id) ?? [],
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ProjectEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map