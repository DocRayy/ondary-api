import { Repository } from 'typeorm';
import { TaskFileEntity } from '../../database/entities';
import { CreateTaskFileRequest, UpdateTaskFileRequest } from './dto';
export declare class TaskFilesService {
    private readonly taskFilesRepository;
    constructor(taskFilesRepository: Repository<TaskFileEntity>);
    create(payload: CreateTaskFileRequest): Promise<{
        title: string;
        message: string;
        data: TaskFileEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskFileEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskFileEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskFileRequest): Promise<{
        title: string;
        message: string;
        data: TaskFileEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
