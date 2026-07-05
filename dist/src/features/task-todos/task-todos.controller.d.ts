import { CreateTaskTodoRequest, TaskTodoIdParam, UpdateTaskTodoRequest } from './dto';
import { TaskTodosService } from './task-todos.service';
export declare class TaskTodosController {
    private readonly taskTodosService;
    constructor(taskTodosService: TaskTodosService);
    create(payload: CreateTaskTodoRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoEntity[] | undefined;
    }>;
    findOne(params: TaskTodoIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoEntity | undefined;
    }>;
    update(params: TaskTodoIdParam, payload: UpdateTaskTodoRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoEntity | undefined;
    }>;
    remove(params: TaskTodoIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
