import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
export declare class TaskUserEntity {
    id: number;
    task_id: number;
    user_id: number;
    task: TaskEntity;
    user: UserEntity;
}
