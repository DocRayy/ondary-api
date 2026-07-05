import { TaskEntity } from '../../../database/entities/task.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { ManagerNoteEntity } from '../../../database/entities/manager-note.entity';
import { TaskTodoEntity } from '../../../database/entities/task-todo.entity';
export declare class NotificationEntity {
    id: number;
    task_id: number | null;
    task_todo_id: number | null;
    manager_note_id: number | null;
    user_id: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
    task: TaskEntity | null;
    taskTodo: TaskTodoEntity | null;
    managerNote: ManagerNoteEntity | null;
    user: UserEntity;
}
