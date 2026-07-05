export declare class CreateTaskTodoRequest {
    task_id: number;
    user_id?: number;
    user_ids?: number[];
    label: string;
    progress?: number;
    status?: string;
    estimate_time?: number;
    due_date?: string;
    finish_date?: string;
    files?: Record<string, unknown>[];
    created_by?: number;
}
export declare class UpdateTaskTodoRequest {
    task_id?: number;
    user_id?: number;
    user_ids?: number[];
    label?: string;
    progress?: number;
    status?: string;
    estimate_time?: number;
    due_date?: string;
    finish_date?: string;
    files?: Record<string, unknown>[];
    created_by?: number;
    updated_by?: number;
}
