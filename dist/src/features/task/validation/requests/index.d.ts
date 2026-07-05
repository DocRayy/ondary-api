export declare const TASK_STATUSES: string[];
export declare class FindTasksQuery {
    user_id?: number;
    project_id?: number;
    month?: number;
    year?: number;
    recently_updated_days?: number;
}
export declare class CreateTaskRequest {
    project_id: number;
    user_id: number;
    task_todo_id?: number;
    title: string;
    description?: string;
    due_date?: string;
    estimate_time?: number;
    finish_date?: string;
    status?: string;
    order_index?: number;
    progress?: number;
    board_column?: string;
    assignee_user_ids?: number[];
    label_ids?: number[];
    bookmarks?: Record<string, unknown>[];
    files?: Record<string, unknown>[];
    movement_history?: Record<string, unknown>[];
    created_by?: number;
}
export declare class UpdateTaskRequest {
    project_id?: number;
    user_id?: number;
    task_todo_id?: number;
    title?: string;
    description?: string;
    due_date?: string;
    estimate_time?: number;
    finish_date?: string;
    status?: string;
    order_index?: number;
    progress?: number;
    moved_at?: string;
    completed_at?: string;
    updated_by?: number;
    board_column?: string;
    assignee_user_ids?: number[];
    label_ids?: number[];
    bookmarks?: Record<string, unknown>[];
    files?: Record<string, unknown>[];
    movement_history?: Record<string, unknown>[];
    created_by?: number;
}
export declare class MoveTaskRequest {
    status: string;
    order_index: number;
}
