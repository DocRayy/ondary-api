import { Repository } from 'typeorm';
import { TaskBookmarkEntity } from '../../database/entities';
import { CreateTaskBookmarkRequest, UpdateTaskBookmarkRequest } from './dto';
export declare class TaskBookmarksService {
    private readonly taskBookmarksRepository;
    constructor(taskBookmarksRepository: Repository<TaskBookmarkEntity>);
    create(payload: CreateTaskBookmarkRequest): Promise<{
        title: string;
        message: string;
        data: TaskBookmarkEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskBookmarkEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskBookmarkEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskBookmarkRequest): Promise<{
        title: string;
        message: string;
        data: TaskBookmarkEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
