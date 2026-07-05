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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const password_util_1 = require("../../common/security/password.util");
const media_url_util_1 = require("../../common/uploads/media-url.util");
const photo_upload_config_1 = require("../../common/uploads/photo-upload.config");
const entities_1 = require("../../database/entities");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(payload, photo) {
        const user = await this.usersRepository.save(this.usersRepository.create({
            ...payload,
            photo: (0, photo_upload_config_1.uploadedPhotoUrl)('users', photo) ?? payload.photo,
            password: await (0, password_util_1.hashPassword)(payload.password),
        }));
        return (0, api_response_util_1.successResponse)('User Created', 'User created successfully', (0, media_url_util_1.withPhotoUrl)((0, remove_passwords_util_1.removePasswords)(user)));
    }
    findAll() {
        return this.usersRepository
            .find({
            relations: {
                projects: true,
                tasks: true,
                taskTodos: true,
                timelogs: true,
                stickyNotes: true,
            },
            order: { id: 'DESC' },
        })
            .then((users) => (0, api_response_util_1.successResponse)('Users Retrieved', 'Users retrieved successfully', (0, media_url_util_1.withPhotoUrl)((0, remove_passwords_util_1.removePasswords)(users))));
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: {
                projects: true,
                tasks: true,
                taskTodos: true,
                timelogs: true,
                stickyNotes: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('User Not Found', `User ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('User Retrieved', 'User retrieved successfully', (0, media_url_util_1.withPhotoUrl)((0, remove_passwords_util_1.removePasswords)(user)));
    }
    findByIdForAuth(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    findByUsernameOrEmail(identifier) {
        const where = [
            { username: identifier },
            { email: identifier },
        ];
        return this.usersRepository.findOne({ where });
    }
    async update(id, payload, photo) {
        const user = await this.usersRepository.preload({
            id,
            ...payload,
            ...(photo ? { photo: (0, photo_upload_config_1.uploadedPhotoUrl)('users', photo) } : {}),
            ...(payload.password
                ? { password: await (0, password_util_1.hashPassword)(payload.password) }
                : {}),
        });
        if (!user) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('User Not Found', `User ${id} was not found`));
        }
        const savedUser = await this.usersRepository.save(user);
        return (0, api_response_util_1.successResponse)('User Updated', 'User updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedUser.id)));
    }
    updatePasswordHash(id, password) {
        return this.usersRepository.update(id, { password });
    }
    async remove(id) {
        const user = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.usersRepository.remove(user);
        return (0, api_response_util_1.successResponse)('User Deleted', 'User deleted successfully');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map