"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmOptions = void 0;
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const typeorm_1 = require("typeorm");
const entities_1 = require("./entities");
const _1712920000000_initial_schema_1 = require("./migrations/1712920000000-initial-schema");
const _1712920000001_kanban_realtime_schema_1 = require("./migrations/1712920000001-kanban-realtime-schema");
const _1712920000002_nullable_timelog_task_todo_1 = require("./migrations/1712920000002-nullable-timelog-task-todo");
const _1712920000003_consolidate_task_schema_1 = require("./migrations/1712920000003-consolidate-task-schema");
const _1712920000004_notes_schema_1 = require("./migrations/1712920000004-notes-schema");
const _1712920000005_notifications_schema_1 = require("./migrations/1712920000005-notifications-schema");
const _1712920000006_task_audit_columns_1 = require("./migrations/1712920000006-task-audit-columns");
const _1712920000007_task_default_todo_1 = require("./migrations/1712920000007-task-default-todo");
const _1712920000008_timelog_status_1 = require("./migrations/1712920000008-timelog-status");
const _1712920000009_task_progress_1 = require("./migrations/1712920000009-task-progress");
const _1712920000010_upload_photo_and_project_timestamps_1 = require("./migrations/1712920000010-upload-photo-and-project-timestamps");
const _1712920000011_timelog_timestamps_1 = require("./migrations/1712920000011-timelog-timestamps");
const _1712920000012_general_notifications_1 = require("./migrations/1712920000012-general-notifications");
const _1712920000013_task_attachments_comments_1 = require("./migrations/1712920000013-task-attachments-comments");
const _1712920000014_task_todo_estimates_users_1 = require("./migrations/1712920000014-task-todo-estimates-users");
const _1712920000015_audit_logs_1 = require("./migrations/1712920000015-audit-logs");
const _1712920000016_audit_log_diff_columns_1 = require("./migrations/1712920000016-audit-log-diff-columns");
const _1712920000017_manager_notes_soft_delete_1 = require("./migrations/1712920000017-manager-notes-soft-delete");
(0, dotenv_1.config)();
const getSslOptions = () => {
    if (process.env.DB_SSL !== 'true') {
        return undefined;
    }
    const ca = process.env.DB_SSL_CA ??
        (process.env.DB_SSL_CA_PATH
            ? (0, fs_1.readFileSync)(process.env.DB_SSL_CA_PATH, 'utf8')
            : undefined);
    return {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        ...(ca ? { ca } : {}),
    };
};
exports.typeOrmOptions = {
    type: 'mysql',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? process.env.DB_NAME ?? 'ondary',
    entities: entities_1.entities,
    migrations: [
        _1712920000000_initial_schema_1.InitialSchema1712920000000,
        _1712920000001_kanban_realtime_schema_1.KanbanRealtimeSchema1712920000001,
        _1712920000002_nullable_timelog_task_todo_1.NullableTimelogTaskTodo1712920000002,
        _1712920000003_consolidate_task_schema_1.ConsolidateTaskSchema1712920000003,
        _1712920000004_notes_schema_1.NotesSchema1712920000004,
        _1712920000005_notifications_schema_1.NotificationsSchema1712920000005,
        _1712920000006_task_audit_columns_1.TaskAuditColumns1712920000006,
        _1712920000007_task_default_todo_1.TaskDefaultTodo1712920000007,
        _1712920000008_timelog_status_1.TimelogStatus1712920000008,
        _1712920000009_task_progress_1.TaskProgress1712920000009,
        _1712920000010_upload_photo_and_project_timestamps_1.UploadPhotoAndProjectTimestamps1712920000010,
        _1712920000011_timelog_timestamps_1.TimelogTimestamps1712920000011,
        _1712920000012_general_notifications_1.GeneralNotifications1712920000012,
        _1712920000013_task_attachments_comments_1.TaskAttachmentsComments1712920000013,
        _1712920000014_task_todo_estimates_users_1.TaskTodoEstimatesUsers1712920000014,
        _1712920000015_audit_logs_1.AuditLogs1712920000015,
        _1712920000016_audit_log_diff_columns_1.AuditLogDiffColumns1712920000016,
        _1712920000017_manager_notes_soft_delete_1.ManagerNotesSoftDelete1712920000017,
    ],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    charset: 'utf8mb4_unicode_ci',
    ssl: getSslOptions(),
};
const dataSourceOptions = {
    ...exports.typeOrmOptions,
    migrationsTableName: 'typeorm_migrations',
};
exports.default = new typeorm_1.DataSource(dataSourceOptions);
//# sourceMappingURL=typeorm.config.js.map