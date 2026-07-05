import { ProjectEntity } from './project.entity';
import { TaskAttachmentEntity } from './task-attachment.entity';
import { TaskCommentEntity } from './task-comment.entity';
import { TaskTodoEntity } from './task-todo.entity';
import { UserEntity } from './user.entity';
export type TaskFileItem = {
    url?: string | null;
    file_path?: string | null;
    note?: string | null;
};
export type TaskBookmarkItem = {
    user_id: number;
    label?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};
export type TaskMovementHistoryItem = {
    from_status: string | null;
    to_status: string;
    from_order_index: number | null;
    to_order_index: number;
    moved_by: number | null;
    moved_at: string;
};
export declare class TaskEntity {
    id: number;
    project_id: number;
    user_id: number;
    task_todo_id: number | null;
    title: string;
    description: string | null;
    due_date: Date | null;
    estimate_time: number | null;
    finish_date: Date | null;
    status: string;
    order_index: number;
    progress: number;
    moved_at: Date | null;
    completed_at: Date | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: Date;
    updated_at: Date;
    board_column: string;
    assignee_user_ids: number[] | null;
    label_ids: number[] | null;
    bookmarks: TaskBookmarkItem[] | null;
    files: TaskFileItem[] | null;
    movement_history: TaskMovementHistoryItem[] | null;
    project: ProjectEntity;
    user: UserEntity;
    createdBy: UserEntity | null;
    updatedBy: UserEntity | null;
    taskTodo: TaskTodoEntity | null;
    todos: TaskTodoEntity[];
    attachments: TaskAttachmentEntity[];
    comments: TaskCommentEntity[];
}
