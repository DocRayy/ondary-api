import { TaskTodoEntity } from './task-todo.entity';
import { TimelogFileEntity } from './timelog-file.entity';
import { UserEntity } from './user.entity';
export declare class TimelogEntity {
    id: number;
    user_id: number;
    task_todo_id: number | null;
    name: string;
    time: string | null;
    status: string;
    start: Date | null;
    end: Date | null;
    start_note: string | null;
    end_note: string | null;
    minuted_logged: number | null;
    created_at: Date;
    updated_at: Date;
    user: UserEntity;
    taskTodo: TaskTodoEntity | null;
    files: TimelogFileEntity[];
}
