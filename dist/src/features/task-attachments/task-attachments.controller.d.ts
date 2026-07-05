import { UploadedFile } from '../../common/uploads/photo-upload.config';
import { CreateTaskAttachmentRequest, TaskAttachmentIdParam, UpdateTaskAttachmentRequest } from './dto';
import { TaskAttachmentsService } from './task-attachments.service';
export declare class TaskAttachmentsController {
    private readonly taskAttachmentsService;
    constructor(taskAttachmentsService: TaskAttachmentsService);
    create(payload: CreateTaskAttachmentRequest, files?: UploadedFile[]): Promise<{
        title: string;
        message: string;
        data: (import("../../database/entities").TaskAttachmentEntity & {
            file_url?: string | null;
            file_path_url?: string | null;
        })[] | undefined;
    }>;
    findAll(taskId?: string): Promise<{
        title: string;
        message: string;
        data: (import("../../database/entities").TaskAttachmentEntity & {
            file_url?: string | null;
            file_path_url?: string | null;
        })[] | undefined;
    }>;
    findOne(params: TaskAttachmentIdParam): Promise<{
        title: string;
        message: string;
        data: (import("../../database/entities").TaskAttachmentEntity & {
            file_url?: string | null;
            file_path_url?: string | null;
        }) | undefined;
    }>;
    update(params: TaskAttachmentIdParam, payload: UpdateTaskAttachmentRequest): Promise<{
        title: string;
        message: string;
        data: (import("../../database/entities").TaskAttachmentEntity & {
            file_url?: string | null;
            file_path_url?: string | null;
        }) | undefined;
    }>;
    remove(params: TaskAttachmentIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
