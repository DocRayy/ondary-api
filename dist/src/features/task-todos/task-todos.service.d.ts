import { Repository } from 'typeorm';
import { TaskEntity, TaskTodoEntity, TaskTodoUserEntity, UserEntity } from '../../database/entities';
import { NotificationService } from '../notification/public/notification.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskTodoRequest, UpdateTaskTodoRequest } from './dto';
export declare class TaskTodosService {
    private readonly taskTodosRepository;
    private readonly taskTodoUsersRepository;
    private readonly taskRepository;
    private readonly userRepository;
    private readonly realtimeService;
    private readonly notificationService;
    constructor(taskTodosRepository: Repository<TaskTodoEntity>, taskTodoUsersRepository: Repository<TaskTodoUserEntity>, taskRepository: Repository<TaskEntity>, userRepository: Repository<UserEntity>, realtimeService: RealtimeService, notificationService: NotificationService);
    create(payload: CreateTaskTodoRequest): Promise<{
        title: string;
        message: string;
        data: TaskTodoEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TaskTodoEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskTodoEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskTodoRequest): Promise<{
        title: string;
        message: string;
        data: TaskTodoEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private syncTaskTodoProgress;
    private syncTaskProgress;
    private getTodoStatusFromTimelog;
    private getTodoProgress;
    private getTaskOrFail;
    private validateTodoUserAssignees;
    private requireManagerForManagerFields;
    private getRequestedTodoUserIds;
    private syncTodoUsers;
    private taskTodoRelations;
    private withTodoPresentation;
    private formatEstimateTime;
    private normalizeUserIds;
    private parseUserIds;
}
