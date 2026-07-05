export declare class FindTaskCommentsQuery {
    task_id?: number;
}
export declare class CreateTaskCommentRequest {
    task_id: number;
    message: string;
}
export declare class UpdateTaskCommentRequest {
    message?: string;
}
