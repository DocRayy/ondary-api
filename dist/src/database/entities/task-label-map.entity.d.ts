import { TaskLabelEntity } from './task-label.entity';
import { TaskEntity } from './task.entity';
export declare class TaskLabelMapEntity {
    task_id: number;
    task_label_id: number;
    created_at: Date;
    task: TaskEntity;
    taskLabel: TaskLabelEntity;
}
