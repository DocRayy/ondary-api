import { TaskTodoEntity } from './task-todo.entity';
import { UserEntity } from './user.entity';
export declare class TaskTodoUserEntity {
    id: number;
    task_todo_id: number;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    taskTodo: TaskTodoEntity;
    user: UserEntity;
}
