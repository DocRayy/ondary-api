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
exports.StickyNotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_response_util_1 = require("../../common/responses/api-response.util");
const remove_passwords_util_1 = require("../../common/serialization/remove-passwords.util");
const entities_1 = require("../../database/entities");
let StickyNotesService = class StickyNotesService {
    stickyNotesRepository;
    constructor(stickyNotesRepository) {
        this.stickyNotesRepository = stickyNotesRepository;
    }
    async create(payload) {
        const stickyNote = await this.stickyNotesRepository.save(this.stickyNotesRepository.create(payload));
        return (0, api_response_util_1.successResponse)('Sticky Note Created', 'Sticky note created successfully', (0, api_response_util_1.responseData)(await this.findOne(stickyNote.id)));
    }
    findAll() {
        return this.stickyNotesRepository
            .find({ relations: { user: true }, order: { id: 'DESC' } })
            .then((stickyNotes) => (0, api_response_util_1.successResponse)('Sticky Notes Retrieved', 'Sticky notes retrieved successfully', (0, remove_passwords_util_1.removePasswords)(stickyNotes)));
    }
    async findOne(id) {
        const stickyNote = await this.stickyNotesRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!stickyNote) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Sticky Note Not Found', `Sticky note ${id} was not found`));
        }
        return (0, api_response_util_1.successResponse)('Sticky Note Retrieved', 'Sticky note retrieved successfully', (0, remove_passwords_util_1.removePasswords)(stickyNote));
    }
    async update(id, payload) {
        const stickyNote = await this.stickyNotesRepository.preload({
            id,
            ...payload,
        });
        if (!stickyNote) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Sticky Note Not Found', `Sticky note ${id} was not found`));
        }
        const savedStickyNote = await this.stickyNotesRepository.save(stickyNote);
        return (0, api_response_util_1.successResponse)('Sticky Note Updated', 'Sticky note updated successfully', (0, api_response_util_1.responseData)(await this.findOne(savedStickyNote.id)));
    }
    async remove(id) {
        const stickyNote = (0, api_response_util_1.responseData)(await this.findOne(id));
        await this.stickyNotesRepository.remove(stickyNote);
        return (0, api_response_util_1.successResponse)('Sticky Note Deleted', 'Sticky note deleted successfully');
    }
};
exports.StickyNotesService = StickyNotesService;
exports.StickyNotesService = StickyNotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StickyNoteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StickyNotesService);
//# sourceMappingURL=sticky-notes.service.js.map