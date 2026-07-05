import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateTaskRequest, FindTasksQuery, MoveTaskRequest, TaskIdParam, UpdateTaskRequest } from './dto';
import { TaskService } from './task.service';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(payload: CreateTaskRequest, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskEntity | undefined;
    }>;
    findAll(query: FindTasksQuery): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskEntity[] | undefined;
    }>;
    pdf(res: any, user: AuthenticatedUser, month?: string, year?: string, type?: string, status?: string, userId?: string, projectId?: string): Promise<void>;
    findOne(params: TaskIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskEntity | undefined;
    }>;
    update(params: TaskIdParam, payload: UpdateTaskRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskEntity | undefined;
    }>;
    move(params: TaskIdParam, payload: MoveTaskRequest, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskEntity | undefined;
    }>;
    remove(params: TaskIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
