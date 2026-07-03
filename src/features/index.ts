import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseBackupsModule } from './database-backups/database-backups.module';
import { ManagerNotesModule } from './manager-notes/manager-notes.module';
import { NotificationModule } from './notification/public/notifcation.module';
import { ProjectsModule } from './projects/projects.module';
import { RealtimeModule } from './realtime/realtime.module';
import { StickyNotesModule } from './sticky-notes/sticky-notes.module';
import { TaskLabelsModule } from './task-labels/task-labels.module';
import { TaskAttachmentsModule } from './task-attachments/task-attachments.module';
import { TaskCommentsModule } from './task-comments/task-comments.module';
import { TaskModule } from './task/task.module';
import { TaskTodosModule } from './task-todos/task-todos.module';
import { TimelogFileModule } from './timelog-file/timelog-file.module';
import { TimelogsModule } from './timelogs/timelogs.module';
import { UsersModule } from './users/users.module';

export const featureModules = [
  AuthModule,
  AuditLogsModule,
  RealtimeModule,
  DatabaseBackupsModule,
  UsersModule,
  ProjectsModule,
  StickyNotesModule,
  ManagerNotesModule,
  NotificationModule,
  TaskModule,
  TaskAttachmentsModule,
  TaskCommentsModule,
  TaskLabelsModule,
  TaskTodosModule,
  TimelogsModule,
  TimelogFileModule,
];
