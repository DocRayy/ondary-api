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
exports.TimelogEntity = void 0;
const typeorm_1 = require("typeorm");
const task_todo_entity_1 = require("./task-todo.entity");
const timelog_file_entity_1 = require("./timelog-file.entity");
const user_entity_1 = require("./user.entity");
let TimelogEntity = class TimelogEntity {
    id;
    user_id;
    task_todo_id;
    name;
    time;
    status;
    start;
    end;
    start_note;
    end_note;
    minuted_logged;
    created_at;
    updated_at;
    user;
    taskTodo;
    files;
};
exports.TimelogEntity = TimelogEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], TimelogEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TimelogEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "task_todo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], TimelogEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'active' }),
    __metadata("design:type", String)
], TimelogEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "start_note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "end_note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "minuted_logged", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TimelogEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TimelogEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.timelogs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], TimelogEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_todo_entity_1.TaskTodoEntity, (taskTodo) => taskTodo.timelogs, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_todo_id' }),
    __metadata("design:type", Object)
], TimelogEntity.prototype, "taskTodo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => timelog_file_entity_1.TimelogFileEntity, (file) => file.timelog),
    __metadata("design:type", Array)
], TimelogEntity.prototype, "files", void 0);
exports.TimelogEntity = TimelogEntity = __decorate([
    (0, typeorm_1.Entity)('timelogs')
], TimelogEntity);
//# sourceMappingURL=timelog.entity.js.map