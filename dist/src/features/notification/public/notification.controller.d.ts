import type { AuthenticatedUser } from '../../auth/types/authenticated-user.type';
import { CreateNotificationRequest } from '../dto/create-notification.dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(payload: CreateNotificationRequest): Promise<{
        title: string;
        message: string;
        data: import("../entities/notification.entity").NotificationEntity[] | undefined;
    }>;
    findAll(user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../entities/notification.entity").NotificationEntity[] | undefined;
    }>;
    findMine(user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../entities/notification.entity").NotificationEntity[] | undefined;
    }>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../entities/notification.entity").NotificationEntity | undefined;
    }>;
    markAsRead(id: string, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: import("../entities/notification.entity").NotificationEntity | undefined;
    }>;
}
