import { Repository } from 'typeorm';
import { TaskLabelMapEntity } from '../../database/entities';
import { CreateTaskLabelMapRequest, TaskLabelMapParams, UpdateTaskLabelMapRequest } from './dto';
export declare class TaskLabelMapsService {
    private readonly taskLabelMapsRepository;
    constructor(taskLabelMapsRepository: Repository<TaskLabelMapEntity>);
    create(payload: CreateTaskLabelMapRequest): Promise<{
        title: string;
        message: string;
        data: TaskLabelMapEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskLabelMapEntity[] | undefined;
    }>;
    findOne(params: TaskLabelMapParams): Promise<{
        title: string;
        message: string;
        data: TaskLabelMapEntity | undefined;
    }>;
    update(params: TaskLabelMapParams, payload: UpdateTaskLabelMapRequest): Promise<{
        title: string;
        message: string;
        data: TaskLabelMapEntity | undefined;
    }>;
    remove(params: TaskLabelMapParams): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
