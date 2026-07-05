import { Repository } from 'typeorm';
import { TaskTodoFileEntity } from '../../database/entities';
import { CreateTaskTodoFileRequest, UpdateTaskTodoFileRequest } from './dto';
export declare class TaskTodoFilesService {
    private readonly taskTodoFilesRepository;
    constructor(taskTodoFilesRepository: Repository<TaskTodoFileEntity>);
    create(payload: CreateTaskTodoFileRequest): Promise<{
        title: string;
        message: string;
        data: TaskTodoFileEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskTodoFileEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskTodoFileEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskTodoFileRequest): Promise<{
        title: string;
        message: string;
        data: TaskTodoFileEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
