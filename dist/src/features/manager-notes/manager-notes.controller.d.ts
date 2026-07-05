import { CreateManagerNoteRequest, ManagerNoteIdParam, UpdateManagerNoteRequest } from './dto';
import { ManagerNotesService } from './manager-notes.service';
export declare class ManagerNotesController {
    private readonly managerNotesService;
    constructor(managerNotesService: ManagerNotesService);
    create(payload: CreateManagerNoteRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ManagerNoteEntity[] | undefined;
    } | {
        title: string;
        message: string;
        data: import("../../database/entities").ManagerNoteEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ManagerNoteEntity[] | undefined;
    }>;
    findRecipients(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").UserEntity[] | undefined;
    }>;
    findOne(params: ManagerNoteIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ManagerNoteEntity | undefined;
    }>;
    update(params: ManagerNoteIdParam, payload: UpdateManagerNoteRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").ManagerNoteEntity | undefined;
    }>;
    remove(params: ManagerNoteIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
