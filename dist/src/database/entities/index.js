"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = exports.TimelogFileEntity = exports.TimelogEntity = exports.TaskEntity = exports.TaskUserEntity = exports.TaskTodoFileEntity = exports.TaskTodoUserEntity = exports.TaskTodoEntity = exports.TaskMovementHistoryEntity = exports.TaskLabelMapEntity = exports.TaskLabelEntity = exports.TaskFileEntity = exports.TaskCommentEntity = exports.TaskBookmarkEntity = exports.TaskAttachmentEntity = exports.StickyNoteEntity = exports.ProjectEntity = exports.NotificationEntity = exports.ManagerNoteEntity = exports.AuditLogEntity = exports.entities = void 0;
const audit_log_entity_1 = require("./audit-log.entity");
Object.defineProperty(exports, "AuditLogEntity", { enumerable: true, get: function () { return audit_log_entity_1.AuditLogEntity; } });
const manager_note_entity_1 = require("./manager-note.entity");
Object.defineProperty(exports, "ManagerNoteEntity", { enumerable: true, get: function () { return manager_note_entity_1.ManagerNoteEntity; } });
const notification_entity_1 = require("../../features/notification/entities/notification.entity");
Object.defineProperty(exports, "NotificationEntity", { enumerable: true, get: function () { return notification_entity_1.NotificationEntity; } });
const project_entity_1 = require("./project.entity");
Object.defineProperty(exports, "ProjectEntity", { enumerable: true, get: function () { return project_entity_1.ProjectEntity; } });
const sticky_note_entity_1 = require("./sticky-note.entity");
Object.defineProperty(exports, "StickyNoteEntity", { enumerable: true, get: function () { return sticky_note_entity_1.StickyNoteEntity; } });
const task_attachment_entity_1 = require("./task-attachment.entity");
Object.defineProperty(exports, "TaskAttachmentEntity", { enumerable: true, get: function () { return task_attachment_entity_1.TaskAttachmentEntity; } });
const task_bookmark_entity_1 = require("./task-bookmark.entity");
Object.defineProperty(exports, "TaskBookmarkEntity", { enumerable: true, get: function () { return task_bookmark_entity_1.TaskBookmarkEntity; } });
const task_comment_entity_1 = require("./task-comment.entity");
Object.defineProperty(exports, "TaskCommentEntity", { enumerable: true, get: function () { return task_comment_entity_1.TaskCommentEntity; } });
const task_file_entity_1 = require("./task-file.entity");
Object.defineProperty(exports, "TaskFileEntity", { enumerable: true, get: function () { return task_file_entity_1.TaskFileEntity; } });
const task_label_map_entity_1 = require("./task-label-map.entity");
Object.defineProperty(exports, "TaskLabelMapEntity", { enumerable: true, get: function () { return task_label_map_entity_1.TaskLabelMapEntity; } });
const task_label_entity_1 = require("./task-label.entity");
Object.defineProperty(exports, "TaskLabelEntity", { enumerable: true, get: function () { return task_label_entity_1.TaskLabelEntity; } });
const task_movement_history_entity_1 = require("./task-movement-history.entity");
Object.defineProperty(exports, "TaskMovementHistoryEntity", { enumerable: true, get: function () { return task_movement_history_entity_1.TaskMovementHistoryEntity; } });
const task_todo_file_entity_1 = require("./task-todo-file.entity");
Object.defineProperty(exports, "TaskTodoFileEntity", { enumerable: true, get: function () { return task_todo_file_entity_1.TaskTodoFileEntity; } });
const task_todo_entity_1 = require("./task-todo.entity");
Object.defineProperty(exports, "TaskTodoEntity", { enumerable: true, get: function () { return task_todo_entity_1.TaskTodoEntity; } });
const task_todo_user_entity_1 = require("./task-todo-user.entity");
Object.defineProperty(exports, "TaskTodoUserEntity", { enumerable: true, get: function () { return task_todo_user_entity_1.TaskTodoUserEntity; } });
const task_user_entity_1 = require("./task-user.entity");
Object.defineProperty(exports, "TaskUserEntity", { enumerable: true, get: function () { return task_user_entity_1.TaskUserEntity; } });
const task_entity_1 = require("./task.entity");
Object.defineProperty(exports, "TaskEntity", { enumerable: true, get: function () { return task_entity_1.TaskEntity; } });
const timelog_file_entity_1 = require("./timelog-file.entity");
Object.defineProperty(exports, "TimelogFileEntity", { enumerable: true, get: function () { return timelog_file_entity_1.TimelogFileEntity; } });
const timelog_entity_1 = require("./timelog.entity");
Object.defineProperty(exports, "TimelogEntity", { enumerable: true, get: function () { return timelog_entity_1.TimelogEntity; } });
const user_entity_1 = require("./user.entity");
Object.defineProperty(exports, "UserEntity", { enumerable: true, get: function () { return user_entity_1.UserEntity; } });
exports.entities = [
    audit_log_entity_1.AuditLogEntity,
    user_entity_1.UserEntity,
    project_entity_1.ProjectEntity,
    task_entity_1.TaskEntity,
    task_label_entity_1.TaskLabelEntity,
    task_todo_entity_1.TaskTodoEntity,
    task_todo_user_entity_1.TaskTodoUserEntity,
    timelog_entity_1.TimelogEntity,
    timelog_file_entity_1.TimelogFileEntity,
    sticky_note_entity_1.StickyNoteEntity,
    manager_note_entity_1.ManagerNoteEntity,
    notification_entity_1.NotificationEntity,
    task_attachment_entity_1.TaskAttachmentEntity,
    task_comment_entity_1.TaskCommentEntity,
];
//# sourceMappingURL=index.js.map