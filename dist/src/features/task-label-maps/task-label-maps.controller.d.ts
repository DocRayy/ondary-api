import { CreateTaskLabelMapRequest, TaskLabelMapParams, UpdateTaskLabelMapRequest } from './dto';
import { TaskLabelMapsService } from './task-label-maps.service';
export declare class TaskLabelMapsController {
    private readonly taskLabelMapsService;
    constructor(taskLabelMapsService: TaskLabelMapsService);
    create(payload: CreateTaskLabelMapRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelMapEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelMapEntity[] | undefined;
    }>;
    findOne(params: TaskLabelMapParams): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelMapEntity | undefined;
    }>;
    update(params: TaskLabelMapParams, payload: UpdateTaskLabelMapRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskLabelMapEntity | undefined;
    }>;
    remove(params: TaskLabelMapParams): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
