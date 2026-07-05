import { CreateTaskBookmarkRequest, TaskBookmarkIdParam, UpdateTaskBookmarkRequest } from './dto';
import { TaskBookmarksService } from './task-bookmarks.service';
export declare class TaskBookmarksController {
    private readonly taskBookmarksService;
    constructor(taskBookmarksService: TaskBookmarksService);
    create(payload: CreateTaskBookmarkRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskBookmarkEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskBookmarkEntity[] | undefined;
    }>;
    findOne(params: TaskBookmarkIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskBookmarkEntity | undefined;
    }>;
    update(params: TaskBookmarkIdParam, payload: UpdateTaskBookmarkRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TaskBookmarkEntity | undefined;
    }>;
    remove(params: TaskBookmarkIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
