import { ProjectEntity } from './project.entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
export declare class TaskMovementHistoryEntity {
    id: number;
    task_id: number;
    project_id: number;
    from_status: string | null;
    to_status: string;
    from_order_index: number | null;
    to_order_index: number;
    moved_by: number | null;
    moved_at: Date;
    task: TaskEntity;
    project: ProjectEntity;
    user: UserEntity | null;
}
