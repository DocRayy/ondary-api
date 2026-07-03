import { config as loadEnv } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { entities } from './entities';
import { InitialSchema1712920000000 } from './migrations/1712920000000-initial-schema';
import { KanbanRealtimeSchema1712920000001 } from './migrations/1712920000001-kanban-realtime-schema';
import { NullableTimelogTaskTodo1712920000002 } from './migrations/1712920000002-nullable-timelog-task-todo';
import { ConsolidateTaskSchema1712920000003 } from './migrations/1712920000003-consolidate-task-schema';
import { NotesSchema1712920000004 } from './migrations/1712920000004-notes-schema';
import { NotificationsSchema1712920000005 } from './migrations/1712920000005-notifications-schema';
import { TaskAuditColumns1712920000006 } from './migrations/1712920000006-task-audit-columns';
import { TaskDefaultTodo1712920000007 } from './migrations/1712920000007-task-default-todo';
import { TimelogStatus1712920000008 } from './migrations/1712920000008-timelog-status';
import { TaskProgress1712920000009 } from './migrations/1712920000009-task-progress';
import { UploadPhotoAndProjectTimestamps1712920000010 } from './migrations/1712920000010-upload-photo-and-project-timestamps';
import { TimelogTimestamps1712920000011 } from './migrations/1712920000011-timelog-timestamps';
import { GeneralNotifications1712920000012 } from './migrations/1712920000012-general-notifications';
import { TaskAttachmentsComments1712920000013 } from './migrations/1712920000013-task-attachments-comments';
import { TaskTodoEstimatesUsers1712920000014 } from './migrations/1712920000014-task-todo-estimates-users';
import { AuditLogs1712920000015 } from './migrations/1712920000015-audit-logs';
import { AuditLogDiffColumns1712920000016 } from './migrations/1712920000016-audit-log-diff-columns';
import { ManagerNotesSoftDelete1712920000017 } from './migrations/1712920000017-manager-notes-soft-delete';

loadEnv();

const getSslOptions = () => {
  if (process.env.DB_SSL !== 'true') {
    return undefined;
  }

  const ca =
    process.env.DB_SSL_CA ??
    (process.env.DB_SSL_CA_PATH
      ? readFileSync(process.env.DB_SSL_CA_PATH, 'utf8')
      : undefined);

  return {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    ...(ca ? { ca } : {}),
  };
};

export const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? process.env.DB_NAME ?? 'ondary',
  entities,
  migrations: [
    InitialSchema1712920000000,
    KanbanRealtimeSchema1712920000001,
    NullableTimelogTaskTodo1712920000002,
    ConsolidateTaskSchema1712920000003,
    NotesSchema1712920000004,
    NotificationsSchema1712920000005,
    TaskAuditColumns1712920000006,
    TaskDefaultTodo1712920000007,
    TimelogStatus1712920000008,
    TaskProgress1712920000009,
    UploadPhotoAndProjectTimestamps1712920000010,
    TimelogTimestamps1712920000011,
    GeneralNotifications1712920000012,
    TaskAttachmentsComments1712920000013,
    TaskTodoEstimatesUsers1712920000014,
    AuditLogs1712920000015,
    AuditLogDiffColumns1712920000016,
    ManagerNotesSoftDelete1712920000017,
  ],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  charset: 'utf8mb4_unicode_ci',
  ssl: getSslOptions(),
};

const dataSourceOptions: DataSourceOptions = {
  ...(typeOrmOptions as DataSourceOptions),
  migrationsTableName: 'typeorm_migrations',
};

export default new DataSource(dataSourceOptions);
