import type { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import { CreateProjectRequest, ProjectIdParam, UpdateProjectRequest } from './dto';
import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(payload: CreateProjectRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ProjectEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ProjectEntity[] | undefined;
    }>;
    findOne(params: ProjectIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ProjectEntity | undefined;
    }>;
    update(params: ProjectIdParam, payload: UpdateProjectRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ProjectEntity | undefined;
    }>;
    remove(params: ProjectIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
