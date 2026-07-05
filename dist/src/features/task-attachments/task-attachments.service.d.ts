import { Repository } from 'typeorm';
import { UploadedFile } from '../../common/uploads/photo-upload.config';
import { TaskAttachmentEntity, TaskEntity } from '../../database/entities';
import { CreateTaskAttachmentRequest, UpdateTaskAttachmentRequest } from './dto';
type TaskAttachmentResponse = TaskAttachmentEntity & {
    file_url?: string | null;
    file_path_url?: string | null;
};
export declare class TaskAttachmentsService {
    private readonly taskAttachmentsRepository;
    private readonly taskRepository;
    constructor(taskAttachmentsRepository: Repository<TaskAttachmentEntity>, taskRepository: Repository<TaskEntity>);
    create(payload: CreateTaskAttachmentRequest, files: UploadedFile[]): Promise<{
        title: string;
        message: string;
        data: TaskAttachmentResponse[] | undefined;
    }>;
    findAll(taskId?: number): Promise<{
        title: string;
        message: string;
        data: TaskAttachmentResponse[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskAttachmentResponse | undefined;
    }>;
    update(id: number, payload: UpdateTaskAttachmentRequest): Promise<{
        title: string;
        message: string;
        data: TaskAttachmentResponse | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private withFileUrls;
    private findTask;
}
export {};
