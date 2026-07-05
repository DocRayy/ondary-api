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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelogFileEntity = void 0;
const typeorm_1 = require("typeorm");
const timelog_entity_1 = require("./timelog.entity");
let TimelogFileEntity = class TimelogFileEntity {
    id;
    timelog_id;
    file_url;
    file_path;
    photo;
    note;
    timelog;
};
exports.TimelogFileEntity = TimelogFileEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], TimelogFileEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TimelogFileEntity.prototype, "timelog_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TimelogFileEntity.prototype, "file_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TimelogFileEntity.prototype, "file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TimelogFileEntity.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TimelogFileEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => timelog_entity_1.TimelogEntity, (timelog) => timelog.files, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'timelog_id' }),
    __metadata("design:type", timelog_entity_1.TimelogEntity)
], TimelogFileEntity.prototype, "timelog", void 0);
exports.TimelogFileEntity = TimelogFileEntity = __decorate([
    (0, typeorm_1.Entity)('timelog_file')
], TimelogFileEntity);
//# sourceMappingURL=timelog-file.entity.js.map