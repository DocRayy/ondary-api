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
exports.TaskTodoUserEntity = void 0;
const typeorm_1 = require("typeorm");
const task_todo_entity_1 = require("./task-todo.entity");
const user_entity_1 = require("./user.entity");
let TaskTodoUserEntity = class TaskTodoUserEntity {
    id;
    task_todo_id;
    user_id;
    created_at;
    updated_at;
    taskTodo;
    user;
};
exports.TaskTodoUserEntity = TaskTodoUserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], TaskTodoUserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TaskTodoUserEntity.prototype, "task_todo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], TaskTodoUserEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TaskTodoUserEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TaskTodoUserEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_todo_entity_1.TaskTodoEntity, (taskTodo) => taskTodo.todoUsers, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'task_todo_id' }),
    __metadata("design:type", task_todo_entity_1.TaskTodoEntity)
], TaskTodoUserEntity.prototype, "taskTodo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.taskTodoAssignments, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], TaskTodoUserEntity.prototype, "user", void 0);
exports.TaskTodoUserEntity = TaskTodoUserEntity = __decorate([
    (0, typeorm_1.Entity)('task_todo_users')
], TaskTodoUserEntity);
//# sourceMappingURL=task-todo-user.entity.js.map