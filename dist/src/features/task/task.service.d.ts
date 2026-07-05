import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Response } from 'express';
import { DataSource, Repository } from 'typeorm';
import { ProjectEntity, TaskEntity, TaskTodoEntity, TimelogEntity, UserEntity } from '../../database/entities';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskRequest, FindTasksQuery, MoveTaskRequest, UpdateTaskRequest } from './dto';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
export declare class TaskService {
    private readonly taskRepository;
    private readonly taskTodosRepository;
    private readonly timelogsRepository;
    private readonly userRepository;
    private readonly projectRepository;
    private readonly dataSource;
    private readonly realtimeService;
    private readonly eventEmitter;
    constructor(taskRepository: Repository<TaskEntity>, taskTodosRepository: Repository<TaskTodoEntity>, timelogsRepository: Repository<TimelogEntity>, userRepository: Repository<UserEntity>, projectRepository: Repository<ProjectEntity>, dataSource: DataSource, realtimeService: RealtimeService, eventEmitter: EventEmitter2);
    create(payload: CreateTaskRequest, currentUserId?: number): Promise<{
        title: string;
        message: string;
        data: TaskEntity | undefined;
    }>;
    findAll(filters?: FindTasksQuery): Promise<{
        title: string;
        message: string;
        data: TaskEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TaskEntity | undefined;
    }>;
    generateTaskReport(res: Response, filters: {
        month?: string;
        year?: string;
        type?: string;
        user_id?: string;
        project_id?: string;
        current_user: AuthenticatedUser;
    }): Promise<void>;
    update(id: number, payload: UpdateTaskRequest): Promise<{
        title: string;
        message: string;
        data: TaskEntity | undefined;
    }>;
    move(id: number, payload: MoveTaskRequest, movedBy: number): Promise<{
        title: string;
        message: string;
        data: TaskEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private getNextOrderIndex;
    private emitStatusUpdated;
    private canReadAllReports;
    private normalizePdfReportPeriod;
    private attachAssigneeUsers;
    private normalizeUserIds;
    private parseUserIds;
    private buildTaskReportData;
    private buildReportFilterSummary;
    private normalizeReportType;
    private formatReportType;
    private getUserDisplayName;
    private buildTodoReportRow;
    private getTodoAssigneeLabel;
    private buildTimelogReportRow;
    private getTimelogMinutes;
    private parseDurationToMinutes;
    private isDateInRange;
    private getReportRowDate;
    private getTimelogReportDate;
    private getWeekOfMonth;
    private formatReportMonth;
    private formatReportDay;
    private formatReportDateTime;
}
