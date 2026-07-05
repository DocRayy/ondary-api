"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelogFileModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../database/entities");
const timelog_file_controller_1 = require("./timelog-file.controller");
const timelog_file_service_1 = require("./timelog-file.service");
let TimelogFileModule = class TimelogFileModule {
};
exports.TimelogFileModule = TimelogFileModule;
exports.TimelogFileModule = TimelogFileModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.TimelogFileEntity])],
        controllers: [timelog_file_controller_1.TimelogFileController],
        providers: [timelog_file_service_1.TimelogFileService],
        exports: [timelog_file_service_1.TimelogFileService],
    })
], TimelogFileModule);
//# sourceMappingURL=timelog-file.module.js.map