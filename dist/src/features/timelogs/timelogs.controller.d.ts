import { CreateTimelogRequest, TimelogIdParam, UpdateTimelogRequest } from './dto';
import { TimelogsService } from './timelogs.service';
export declare class TimelogsController {
    private readonly timelogsService;
    constructor(timelogsService: TimelogsService);
    create(payload: CreateTimelogRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogEntity[] | undefined;
    }>;
    findOne(params: TimelogIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogEntity | undefined;
    }>;
    update(params: TimelogIdParam, payload: UpdateTimelogRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogEntity | undefined;
    }>;
    remove(params: TimelogIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
