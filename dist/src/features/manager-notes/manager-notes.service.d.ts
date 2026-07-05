import { Repository } from 'typeorm';
import { ManagerNoteEntity, UserEntity } from '../../database/entities';
import { NotificationService } from '../notification/public/notification.service';
import { CreateManagerNoteRequest, UpdateManagerNoteRequest } from './dto';
export declare class ManagerNotesService {
    private readonly managerNotesRepository;
    private readonly usersRepository;
    private readonly notificationService;
    constructor(managerNotesRepository: Repository<ManagerNoteEntity>, usersRepository: Repository<UserEntity>, notificationService: NotificationService);
    create(payload: CreateManagerNoteRequest): Promise<{
        title: string;
        message: string;
        data: ManagerNoteEntity[] | undefined;
    } | {
        title: string;
        message: string;
        data: ManagerNoteEntity | undefined;
    }>;
    private createForAllRecipients;
    findRecipients(): Promise<{
        title: string;
        message: string;
        data: UserEntity[] | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: ManagerNoteEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: ManagerNoteEntity | undefined;
    }>;
    update(id: number, payload: UpdateManagerNoteRequest): Promise<{
        title: string;
        message: string;
        data: ManagerNoteEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private validateRecipientUser;
}
