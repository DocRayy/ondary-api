import { Repository } from 'typeorm';
import { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import { TimelogFileEntity } from '../../database/entities';
import { CreateTimelogFileRequest, UpdateTimelogFileRequest } from './dto';
export declare class TimelogFileService {
    private readonly timelogFileRepository;
    constructor(timelogFileRepository: Repository<TimelogFileEntity>);
    create(payload: CreateTimelogFileRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: TimelogFileEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TimelogFileEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TimelogFileEntity | undefined;
    }>;
    update(id: number, payload: UpdateTimelogFileRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: TimelogFileEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
