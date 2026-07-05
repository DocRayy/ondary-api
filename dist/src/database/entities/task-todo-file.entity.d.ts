import { TaskTodoEntity } from './task-todo.entity';
export declare class TaskTodoFileEntity {
    id: number;
    task_todo_id: number;
    url: string | null;
    file_path: string | null;
    note: string | null;
    taskTodo: TaskTodoEntity;
}
