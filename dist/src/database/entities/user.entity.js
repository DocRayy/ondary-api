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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const manager_note_entity_1 = require("./manager-note.entity");
const sticky_note_entity_1 = require("./sticky-note.entity");
const task_comment_entity_1 = require("./task-comment.entity");
const task_entity_1 = require("./task.entity");
const task_todo_entity_1 = require("./task-todo.entity");
const task_todo_user_entity_1 = require("./task-todo-user.entity");
const timelog_entity_1 = require("./timelog.entity");
let UserEntity = class UserEntity {
    id;
    username;
    email;
    password;
    name;
    phone_no;
    is_verified;
    role;
    status;
    photo;
    created_at;
    updated_at;
    projects;
    tasks;
    taskTodos;
    taskTodoAssignments;
    timelogs;
    stickyNotes;
    managerNotes;
    taskComments;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "phone_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'member' }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: 'active' }),
    __metadata("design:type", String)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.ProjectEntity, (project) => project.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.TaskEntity, (task) => task.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_todo_entity_1.TaskTodoEntity, (taskTodo) => taskTodo.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "taskTodos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_todo_user_entity_1.TaskTodoUserEntity, (assignment) => assignment.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "taskTodoAssignments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => timelog_entity_1.TimelogEntity, (timelog) => timelog.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "timelogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sticky_note_entity_1.StickyNoteEntity, (stickyNote) => stickyNote.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "stickyNotes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => manager_note_entity_1.ManagerNoteEntity, (managerNote) => managerNote.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "managerNotes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_comment_entity_1.TaskCommentEntity, (taskComment) => taskComment.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "taskComments", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map