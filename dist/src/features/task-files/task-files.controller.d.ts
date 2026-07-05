import { CreateTaskFileRequest, TaskFileIdParam, UpdateTaskFileRequest } from './dto';
import { TaskFilesService } from './task-files.service';
export declare class TaskFilesController {
    private readonly taskFilesService;
    constructor(taskFilesService: TaskFilesService);
    create(payload: CreateTaskFileRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskFileEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskFileEntity[] | undefined;
    }>;
    findOne(params: TaskFileIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskFileEntity | undefined;
    }>;
    update(params: TaskFileIdParam, payload: UpdateTaskFileRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskFileEntity | undefined;
    }>;
    remove(params: TaskFileIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
