import { ManagerNoteEntity } from './manager-note.entity';
import { NotificationEntity } from '../../features/notification/entities/notification.entity';
import { ProjectEntity } from './project.entity';
import { StickyNoteEntity } from './sticky-note.entity';
import { TaskBookmarkEntity } from './task-bookmark.entity';
import { TaskFileEntity } from './task-file.entity';
import { TaskLabelMapEntity } from './task-label-map.entity';
import { TaskLabelEntity } from './task-label.entity';
import { TaskMovementHistoryEntity } from './task-movement-history.entity';
import { TaskTodoFileEntity } from './task-todo-file.entity';
import { TaskTodoEntity } from './task-todo.entity';
import { TaskUserEntity } from './task-user.entity';
import { TaskEntity } from './task.entity';
import { TimelogFileEntity } from './timelog-file.entity';
import { TimelogEntity } from './timelog.entity';
import { UserEntity } from './user.entity';

export const entities = [
  UserEntity,
  ProjectEntity,
  TaskEntity,
  TaskLabelEntity,
  TaskTodoEntity,
  TimelogEntity,
  TimelogFileEntity,
  StickyNoteEntity,
  ManagerNoteEntity,
  NotificationEntity,
];

export {
  ManagerNoteEntity,
  NotificationEntity,
  ProjectEntity,
  StickyNoteEntity,
  TaskBookmarkEntity,
  TaskFileEntity,
  TaskLabelEntity,
  TaskLabelMapEntity,
  TaskMovementHistoryEntity,
  TaskTodoEntity,
  TaskTodoFileEntity,
  TaskUserEntity,
  TaskEntity,
  TimelogEntity,
  TimelogFileEntity,
  UserEntity,
};
