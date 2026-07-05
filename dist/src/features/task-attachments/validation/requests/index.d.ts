export declare class CreateTaskAttachmentRequest {
    task_id: number;
}
export declare class UpdateTaskAttachmentRequest {
    task_id?: number;
    files?: string;
    file_path?: string;
    original_name?: string;
    mime_type?: string;
    size?: number;
}
