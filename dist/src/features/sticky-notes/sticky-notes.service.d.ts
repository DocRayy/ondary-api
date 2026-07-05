import { Repository } from 'typeorm';
import { StickyNoteEntity } from '../../database/entities';
import { CreateStickyNoteRequest, UpdateStickyNoteRequest } from './dto';
export declare class StickyNotesService {
    private readonly stickyNotesRepository;
    constructor(stickyNotesRepository: Repository<StickyNoteEntity>);
    create(payload: CreateStickyNoteRequest): Promise<{
        title: string;
        message: string;
        data: StickyNoteEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: StickyNoteEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: StickyNoteEntity | undefined;
    }>;
    update(id: number, payload: UpdateStickyNoteRequest): Promise<{
        title: string;
        message: string;
        data: StickyNoteEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
