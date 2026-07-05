"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureModules = void 0;
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const auth_module_1 = require("./auth/auth.module");
const database_backups_module_1 = require("./database-backups/database-backups.module");
const manager_notes_module_1 = require("./manager-notes/manager-notes.module");
const notifcation_module_1 = require("./notification/public/notifcation.module");
const projects_module_1 = require("./projects/projects.module");
const realtime_module_1 = require("./realtime/realtime.module");
const sticky_notes_module_1 = require("./sticky-notes/sticky-notes.module");
const task_labels_module_1 = require("./task-labels/task-labels.module");
const task_attachments_module_1 = require("./task-attachments/task-attachments.module");
const task_comments_module_1 = require("./task-comments/task-comments.module");
const task_module_1 = require("./task/task.module");
const task_todos_module_1 = require("./task-todos/task-todos.module");
const timelog_file_module_1 = require("./timelog-file/timelog-file.module");
const timelogs_module_1 = require("./timelogs/timelogs.module");
const users_module_1 = require("./users/users.module");
exports.featureModules = [
    auth_module_1.AuthModule,
    audit_logs_module_1.AuditLogsModule,
    realtime_module_1.RealtimeModule,
    database_backups_module_1.DatabaseBackupsModule,
    users_module_1.UsersModule,
    projects_module_1.ProjectsModule,
    sticky_notes_module_1.StickyNotesModule,
    manager_notes_module_1.ManagerNotesModule,
    notifcation_module_1.NotificationModule,
    task_module_1.TaskModule,
    task_attachments_module_1.TaskAttachmentsModule,
    task_comments_module_1.TaskCommentsModule,
    task_labels_module_1.TaskLabelsModule,
    task_todos_module_1.TaskTodosModule,
    timelogs_module_1.TimelogsModule,
    timelog_file_module_1.TimelogFileModule,
];
//# sourceMappingURL=index.js.map