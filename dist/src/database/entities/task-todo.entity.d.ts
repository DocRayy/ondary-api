import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
import { TimelogEntity } from './timelog.entity';
import { TaskTodoUserEntity } from './task-todo-user.entity';
export type TaskTodoFileItem = {
    url?: string | null;
    file_path?: string | null;
    note?: string | null;
};
export declare class TaskTodoEntity {
    id: number;
    task_id: number;
    user_id: number | null;
    label: string;
    progress: number;
    status: string;
    estimate_time: number | null;
    due_date: Date | null;
    finish_date: Date | null;
    files: TaskTodoFileItem[] | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Date;
    updated_at: Date;
    task: TaskEntity;
    user: UserEntity | null;
    createdBy: UserEntity | null;
    updatedBy: UserEntity | null;
    timelogs: TimelogEntity[];
    todoUsers: TaskTodoUserEntity[];
}
