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
exports.StickyNotesController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const sticky_notes_service_1 = require("./sticky-notes.service");
let StickyNotesController = class StickyNotesController {
    stickyNotesService;
    constructor(stickyNotesService) {
        this.stickyNotesService = stickyNotesService;
    }
    create(payload) {
        return this.stickyNotesService.create(payload);
    }
    findAll() {
        return this.stickyNotesService.findAll();
    }
    findOne(params) {
        return this.stickyNotesService.findOne(params.id);
    }
    update(params, payload) {
        return this.stickyNotesService.update(params.id, payload);
    }
    remove(params) {
        return this.stickyNotesService.remove(params.id);
    }
};
exports.StickyNotesController = StickyNotesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateStickyNoteRequest]),
    __metadata("design:returntype", void 0)
], StickyNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StickyNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StickyNoteIdParam]),
    __metadata("design:returntype", void 0)
], StickyNotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StickyNoteIdParam,
        dto_1.UpdateStickyNoteRequest]),
    __metadata("design:returntype", void 0)
], StickyNotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StickyNoteIdParam]),
    __metadata("design:returntype", void 0)
], StickyNotesController.prototype, "remove", null);
exports.StickyNotesController = StickyNotesController = __decorate([
    (0, common_1.Controller)('sticky-notes'),
    __metadata("design:paramtypes", [sticky_notes_service_1.StickyNotesService])
], StickyNotesController);
//# sourceMappingURL=sticky-notes.controller.js.map