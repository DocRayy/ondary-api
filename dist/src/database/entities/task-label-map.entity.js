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
exports.TaskLabelMapEntity = void 0;
const typeorm_1 = require("typeorm");
const task_label_entity_1 = require("./task-label.entity");
const task_entity_1 = require("./task.entity");
let TaskLabelMapEntity = class TaskLabelMapEntity {
    task_id;
    task_label_id;
    created_at;
    task;
    taskLabel;
};
exports.TaskLabelMapEntity = TaskLabelMapEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TaskLabelMapEntity.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TaskLabelMapEntity.prototype, "task_label_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TaskLabelMapEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.TaskEntity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_entity_1.TaskEntity)
], TaskLabelMapEntity.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_label_entity_1.TaskLabelEntity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_label_id' }),
    __metadata("design:type", task_label_entity_1.TaskLabelEntity)
], TaskLabelMapEntity.prototype, "taskLabel", void 0);
exports.TaskLabelMapEntity = TaskLabelMapEntity = __decorate([
    (0, typeorm_1.Entity)('task_label_maps')
], TaskLabelMapEntity);
//# sourceMappingURL=task-label-map.entity.js.map