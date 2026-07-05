import { CreateTaskTodoFileRequest, TaskTodoFileIdParam, UpdateTaskTodoFileRequest } from './dto';
import { TaskTodoFilesService } from './task-todo-files.service';
export declare class TaskTodoFilesController {
    private readonly taskTodoFilesService;
    constructor(taskTodoFilesService: TaskTodoFilesService);
    create(payload: CreateTaskTodoFileRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoFileEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoFileEntity[] | undefined;
    }>;
    findOne(params: TaskTodoFileIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoFileEntity | undefined;
    }>;
    update(params: TaskTodoFileIdParam, payload: UpdateTaskTodoFileRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskTodoFileEntity | undefined;
    }>;
    remove(params: TaskTodoFileIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
