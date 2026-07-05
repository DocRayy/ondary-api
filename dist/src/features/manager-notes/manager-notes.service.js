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
exports.ManagerNotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
const notification_service_1 = require("../notification/public/notification.service");
const MANAGER_NOTE_RECIPIENT_ROLES = ['member', 'admin'];
let ManagerNotesService = class ManagerNotesService {
    managerNotesRepository;
    usersRepository;
    notificationService;
    constructor(managerNotesRepository, usersRepository, notificationService) {
        this.managerNotesRepository = managerNotesRepository;
        this.usersRepository = usersRepository;
        this.notificationService = notificationService;
    }
    async create(payload) {
        if (payload.send_to_all) {
            return this.createForAllRecipients(payload);
        }
        const userId = payload.user_id;
        if (!userId) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Manager Note Recipient Required', 'user_id is required unless send_to_all is true'));
        }
        await this.validateRecipientUser(userId);
        const managerNote = await this.managerNotesRepository.save(this.managerNotesRepository.create({
            user_id: userId,
            title: payload.title,
            description: payload.description,
        }));
        await this.notificationService.createForManagerNoteCreated(managerNote);
        return (0, api_response_util_1.successResponse)('Manager Note Created', 'Manager note created successfully', (0, api_response_util_1.responseData)(await this.findOne(managerNote.id)));
    }
    async createForAllRecipients(payload) {
        const recipients = await this.usersRepository.find({
            where: { role: (0, typeorm_2.In)(MANAGER_NOTE_RECIPIENT_ROLES) },
            select: { id: true },
        });
        if (recipients.length === 0) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Manager Note Recipients Not Found', 'No eligible manager note recipients were found'));
        }
        const managerNotes = await this.managerNotesRepository.save(recipients.map((recipient) => this.managerNotesRepository.create({
            user_id: recipient.id,
            title: payload.title,
            description: payload.description,
        })));
        await Promise.all(managerNotes.map((managerNote) => this.notificationService.createForManagerNoteCreated(managerNote)));
        return (0, api_response_util_1.successResponse)('Manager Notes Created', 'Manager notes created successfully for all recipients', (0, remove_passwords_util_1.removePasswords)(managerNotes));
    }
    findRecipients() {
        return this.usersRepository
            .find({
            where: { role: (0, typeorm_2.In)(MANAGER_NOTE_RECIPIENT_ROLES) },
            order: { id: 'DESC' },
        })
            .then((users) => (0, api_response_util_1.successResponse)('Manager Note Recipients Retrieved', 'Manager note recipients retrieved successfully', (0, remove_passwords_util_1.removePasswords)(users)));
    }
    findAll() {
        return this.managerNotesRepository
            .find({ relations: { user: true }, order: { id: 'DESC' } })
            .then((managerNotes) => (0, api_response_util_1.successResponse)('Manager Notes Retrieved', 'Manager notes retrieved successfully', (0, remove_passwords_util_1.removePasswords)(managerNotes)));
    }
    async findOne(id) {
        const managerNote = await this.managerNotesRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!managerNote) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Manager Note Not Found', `Manager note ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Manager Note Retrieved', 'Manager note retrieved successfully', (0, remove_passwords_util_1.removePasswords)(managerNote));
    }
    async update(id, payload) {
        if (payload.user_id) {
            await this.validateRecipientUser(payload.user_id);
        }
        const managerNote = await this.managerNotesRepository.preload({
            id,
            ...payload,
        });
        if (!managerNote) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Manager Note Not Found', `Manager note ${id} was not found`));
        }
        const savedManagerNote = await this.managerNotesRepository.save(managerNote);
        return (0, api_response_util_1.successResponse)('Manager Note Updated', 'Manager note updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedManagerNote.id)));
    }
    async remove(id) {
        const managerNote = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.managerNotesRepository.softRemove(managerNote);
        return (0, api_response_util_1.successResponse)('Manager Note Deleted', 'Manager note deleted successfully');
    }
    async validateRecipientUser(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!user) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('User Not Found', `User ${userId} was not found`));
        }
        if (!MANAGER_NOTE_RECIPIENT_ROLES.includes(user.role)) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Invalid Manager Note Recipient', 'Manager note can only be sent to users with member or admin roles'));
        }
    }
};
exports.ManagerNotesService = ManagerNotesService;
exports.ManagerNotesService = ManagerNotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ManagerNoteEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ManagerNotesService);
//# sourceMappingURL=manager-notes.service.js.map