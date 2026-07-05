"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTodosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../database/entities");
const realtime_module_1 = require("../realtime/realtime.module");
const notifcation_module_1 = require("../notification/public/notifcation.module");
const task_todos_controller_1 = require("./task-todos.controller");
const task_todos_service_1 = require("./task-todos.service");
let TaskTodosModule = class TaskTodosModule {
};
exports.TaskTodosModule = TaskTodosModule;
exports.TaskTodosModule = TaskTodosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.TaskTodoEntity,
                entities_1.TaskTodoUserEntity,
                entities_1.TaskEntity,
                entities_1.UserEntity,
            ]),
            realtime_module_1.RealtimeModule,
            notifcation_module_1.NotificationModule,
        ],
        controllers: [task_todos_controller_1.TaskTodosController],
        providers: [task_todos_service_1.TaskTodosService],
        exports: [task_todos_service_1.TaskTodosService],
    })
], TaskTodosModule);
//# sourceMappingURL=task-todos.module.js.map