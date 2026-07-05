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
exports.TimelogFileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photo_upload_config_1 = require("../../common/uploads/photo-upload.config");
const dto_1 = require("./dto");
const timelog_file_service_1 = require("./timelog-file.service");
let TimelogFileController = class TimelogFileController {
    timelogFileService;
    constructor(timelogFileService) {
        this.timelogFileService = timelogFileService;
    }
    create(payload, photo) {
        return this.timelogFileService.create(payload, photo);
    }
    findAll() {
        return this.timelogFileService.findAll();
    }
    findOne(params) {
        return this.timelogFileService.findOne(params.id);
    }
    update(params, payload, photo) {
        return this.timelogFileService.update(params.id, payload, photo);
    }
    remove(params) {
        return this.timelogFileService.remove(params.id);
    }
};
exports.TimelogFileController = TimelogFileController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', (0, photo_upload_config_1.photoUploadOptions)('timelog-file'))),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTimelogFileRequest, Object]),
    __metadata("design:returntype", void 0)
], TimelogFileController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimelogFileController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TimelogFileIdParam]),
    __metadata("design:returntype", void 0)
], TimelogFileController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', (0, photo_upload_config_1.photoUploadOptions)('timelog-file'))),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TimelogFileIdParam,
        dto_1.UpdateTimelogFileRequest, Object]),
    __metadata("design:returntype", void 0)
], TimelogFileController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TimelogFileIdParam]),
    __metadata("design:returntype", void 0)
], TimelogFileController.prototype, "remove", null);
exports.TimelogFileController = TimelogFileController = __decorate([
    (0, common_1.Controller)('timelog-file'),
    __metadata("design:paramtypes", [timelog_file_service_1.TimelogFileService])
], TimelogFileController);
//# sourceMappingURL=timelog-file.controller.js.map