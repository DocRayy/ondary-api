import { CreateStickyNoteRequest, StickyNoteIdParam, UpdateStickyNoteRequest } from './dto';
import { StickyNotesService } from './sticky-notes.service';
export declare class StickyNotesController {
    private readonly stickyNotesService;
    constructor(stickyNotesService: StickyNotesService);
    create(payload: CreateStickyNoteRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").StickyNoteEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").StickyNoteEntity[] | undefined;
    }>;
    findOne(params: StickyNoteIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").StickyNoteEntity | undefined;
    }>;
    update(params: StickyNoteIdParam, payload: UpdateStickyNoteRequest): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").StickyNoteEntity | undefined;
    }>;
    remove(params: StickyNoteIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
