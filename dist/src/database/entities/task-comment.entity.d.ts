import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
export declare class TaskCommentEntity {
    id: number;
    task_id: number;
    user_id: number;
    message: string;
    created_at: Date;
    updated_at: Date;
    task: TaskEntity;
    user: UserEntity;
}
