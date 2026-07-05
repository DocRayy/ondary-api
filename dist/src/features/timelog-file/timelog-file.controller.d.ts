import type { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import { CreateTimelogFileRequest, TimelogFileIdParam, UpdateTimelogFileRequest } from './dto';
import { TimelogFileService } from './timelog-file.service';
export declare class TimelogFileController {
    private readonly timelogFileService;
    constructor(timelogFileService: TimelogFileService);
    create(payload: CreateTimelogFileRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogFileEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogFileEntity[] | undefined;
    }>;
    findOne(params: TimelogFileIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogFileEntity | undefined;
    }>;
    update(params: TimelogFileIdParam, payload: UpdateTimelogFileRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").TimelogFileEntity | undefined;
    }>;
    remove(params: TimelogFileIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
