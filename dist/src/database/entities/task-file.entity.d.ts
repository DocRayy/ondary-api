import { TaskEntity } from './task.entity';
export declare class TaskFileEntity {
    id: number;
    task_id: number;
    url: string | null;
    file_path: string | null;
    note: string | null;
    task: TaskEntity;
}
