import { Repository } from 'typeorm';
import { TaskCommentEntity, TaskEntity, UserEntity } from '../../database/entities';
import { NotificationService } from '../notification/public/notification.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskCommentRequest, FindTaskCommentsQuery, UpdateTaskCommentRequest } from './dto';
export declare class TaskCommentsService {
    private readonly taskCommentsRepository;
    private readonly taskRepository;
    private readonly userRepository;
    private readonly notificationService;
    private readonly realtimeService;
    constructor(taskCommentsRepository: Repository<TaskCommentEntity>, taskRepository: Repository<TaskEntity>, userRepository: Repository<UserEntity>, notificationService: NotificationService, realtimeService: RealtimeService);
    findAll(query?: FindTaskCommentsQuery): Promise<{
        title: string;
        message: string;
        data: TaskCommentEntity[] | undefined;
    }>;
    create(payload: CreateTaskCommentRequest, userId: number): Promise<{
        title: string;
        message: string;
        data: TaskCommentEntity | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskCommentEntity | undefined;
    }>;
    update(id: number, payload: UpdateTaskCommentRequest): Promise<{
        title: string;
        message: string;
        data: TaskCommentEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private notifyMentionedUsers;
    private extractMentionedUsernames;
    private findTask;
    private findUser;
}
