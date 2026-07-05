import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
export declare class TaskBookmarkEntity {
    id: number;
    task_id: number;
    user_id: number;
    label: string;
    created_at: Date;
    updated_at: Date;
    task: TaskEntity;
    user: UserEntity;
}
