import { Repository } from 'typeorm';
import { TaskLabelEntity } from '../../database/entities';
import { CreateTaskLabelRequest, UpdateTaskLabelRequest } from './dto';
export declare class TaskLabelsService {
    private readonly taskLabelsRepository;
    constructor(taskLabelsRepository: Repository<TaskLabelEntity>);
    create(payload: CreateTaskLabelRequest): Promise<{
        title: string;
        message: string;
        data: TaskLabelEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskLabelEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskLabelEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskLabelRequest): Promise<{
        title: string;
        message: string;
        data: TaskLabelEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
