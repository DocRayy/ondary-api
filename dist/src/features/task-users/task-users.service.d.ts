import { Repository } from 'typeorm';
import { TaskUserEntity } from '../../database/entities';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskUserRequest, UpdateTaskUserRequest } from './dto';
export declare class TaskUsersService {
    private readonly taskUsersRepository;
    private readonly realtimeService;
    constructor(taskUsersRepository: Repository<TaskUserEntity>, realtimeService: RealtimeService);
    create(payload: CreateTaskUserRequest): Promise<{
        title: string;
        message: string;
        data: TaskUserEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskUserEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskUserEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskUserRequest): Promise<{
        title: string;
        message: string;
        data: TaskUserEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
