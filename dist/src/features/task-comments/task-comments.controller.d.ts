import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateTaskCommentRequest, FindTaskCommentsQuery, TaskCommentIdParam, UpdateTaskCommentRequest } from './dto';
import { TaskCommentsService } from './task-comments.service';
export declare class TaskCommentsController {
    private readonly taskCommentsService;
    constructor(taskCommentsService: TaskCommentsService);
    findAll(query: FindTaskCommentsQuery): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskCommentEntity[] | undefined;
    }>;
    create(payload: CreateTaskCommentRequest, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskCommentEntity | undefined;
    }>;
    findOne(params: TaskCommentIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskCommentEntity | undefined;
    }>;
    update(params: TaskCommentIdParam, payload: UpdateTaskCommentRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskCommentEntity | undefined;
    }>;
    remove(params: TaskCommentIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
