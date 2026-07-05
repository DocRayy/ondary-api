import { CreateTaskUserRequest, TaskUserIdParam, UpdateTaskUserRequest } from './dto';
import { TaskUsersService } from './task-users.service';
export declare class TaskUsersController {
    private readonly taskUsersService;
    constructor(taskUsersService: TaskUsersService);
    create(payload: CreateTaskUserRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskUserEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskUserEntity[] | undefined;
    }>;
    findOne(params: TaskUserIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskUserEntity | undefined;
    }>;
    update(params: TaskUserIdParam, payload: UpdateTaskUserRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskUserEntity | undefined;
    }>;
    remove(params: TaskUserIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
