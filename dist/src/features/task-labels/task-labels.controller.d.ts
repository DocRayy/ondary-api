import { CreateTaskLabelRequest, TaskLabelIdParam, UpdateTaskLabelRequest } from './dto';
import { TaskLabelsService } from './task-labels.service';
export declare class TaskLabelsController {
    private readonly taskLabelsService;
    constructor(taskLabelsService: TaskLabelsService);
    create(payload: CreateTaskLabelRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelEntity[] | undefined;
    }>;
    findOne(params: TaskLabelIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelEntity | undefined;
    }>;
    update(params: TaskLabelIdParam, payload: UpdateTaskLabelRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelEntity | undefined;
    }>;
    remove(params: TaskLabelIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
