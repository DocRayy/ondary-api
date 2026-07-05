export declare const TIMELOG_STATUSES: string[];
export declare class CreateTimelogRequest {
    user_id: number;
    task_todo_id?: number;
    name: string;
    time?: string;
    status?: string;
    start?: string;
    end?: string;
    start_note?: string;
    end_note?: string;
    minuted_logged?: number;
}
export declare class UpdateTimelogRequest {
    user_id?: number;
    task_todo_id?: number;
    name?: string;
    time?: string;
    status?: string;
    start?: string;
    end?: string;
    start_note?: string;
    end_note?: string;
    minuted_logged?: number;
}
