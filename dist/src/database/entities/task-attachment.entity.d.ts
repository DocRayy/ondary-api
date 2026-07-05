import { TaskEntity } from './task.entity';
export declare class TaskAttachmentEntity {
    id: number;
    task_id: number;
    files: string;
    file_path: string | null;
    original_name: string | null;
    mime_type: string | null;
    size: number | null;
    created_at: Date;
    updated_at: Date;
    task: TaskEntity;
}
