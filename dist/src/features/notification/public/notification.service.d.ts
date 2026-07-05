import { Repository } from 'typeorm';
import { ManagerNoteEntity, TaskEntity, TaskTodoEntity, UserEntity } from '../../../database/entities';
import { NotificationEntity } from '../entities/notification.entity';
import { CreateNotificationRequest } from '../dto/create-notification.dto';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.type';
import { RealtimeService } from '../../realtime/realtime.service';
export declare const TASK_CREATED_EVENT = "task.created";
export declare const TASK_STATUS_UPDATED_EVENT = "task.status.updated";
export type TaskCreatedEvent = {
    task_id: number;
};
export type TaskStatusUpdatedEvent = {
    task_id: number;
    previous_status: string;
    current_status: string;
    updated_by?: number | null;
};
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly taskRepository;
    private readonly userRepository;
    private readonly realtimeService;
    constructor(notificationRepository: Repository<NotificationEntity>, taskRepository: Repository<TaskEntity>, userRepository: Repository<UserEntity>, realtimeService: RealtimeService);
    create(payload: CreateNotificationRequest): Promise<{
        title: string;
        message: string;
        data: NotificationEntity[] | undefined;
    }>;
    findAll(user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: NotificationEntity[] | undefined;
    }>;
    createForTaskTodoCreated(taskTodo: TaskTodoEntity, task: TaskEntity, recipientIds?: number[]): Promise<NotificationEntity[]>;
    createForManagerNoteCreated(managerNote: ManagerNoteEntity): Promise<NotificationEntity[]>;
    createForTaskCommentMention(task: TaskEntity, recipientIds: number[]): Promise<NotificationEntity[]>;
    findMine(user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: NotificationEntity[] | undefined;
    }>;
    findOne(id: number, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: NotificationEntity | undefined;
    }>;
    markAsRead(id: number, user: AuthenticatedUser): Promise<{
        title: string;
        message: string;
        data: NotificationEntity | undefined;
    }>;
    handleTaskCreated(payload: TaskCreatedEvent): Promise<NotificationEntity[]>;
    handleTaskStatusUpdated(payload: TaskStatusUpdatedEvent): Promise<NotificationEntity[]>;
    private findTask;
    private createForTaskStatus;
    private createForUsers;
    private getTaskRecipientIds;
    private canReadAll;
}
