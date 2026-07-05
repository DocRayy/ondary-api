import { Repository } from 'typeorm';
import { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import { ProjectEntity } from '../../database/entities';
import { CreateProjectRequest, UpdateProjectRequest } from './dto';
export declare class ProjectsService {
    private readonly projectsRepository;
    constructor(projectsRepository: Repository<ProjectEntity>);
    create(payload: CreateProjectRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: ProjectEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: ProjectEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: ProjectEntity | undefined;
    }>;
    update(id: number, payload: UpdateProjectRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: ProjectEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private withTaskIds;
}
