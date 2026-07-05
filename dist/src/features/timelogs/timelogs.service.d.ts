import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskEntity, TaskTodoEntity, TimelogEntity } from '../../database/entities';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTimelogRequest, UpdateTimelogRequest } from './dto';
export declare class TimelogsService implements OnModuleInit, OnModuleDestroy {
    private readonly timelogsRepository;
    private readonly taskTodosRepository;
    private readonly taskRepository;
    private readonly realtimeService;
    private readonly warningSentKeys;
    private monitorInterval?;
    constructor(timelogsRepository: Repository<TimelogEntity>, taskTodosRepository: Repository<TaskTodoEntity>, taskRepository: Repository<TaskEntity>, realtimeService: RealtimeService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    create(payload: CreateTimelogRequest): Promise<{
        title: string;
        message: string;
        data: TimelogEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: TimelogEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: TimelogEntity | undefined;
    }>;
    update(id: number, payload: UpdateTimelogRequest): Promise<{
        title: string;
        message: string;
        data: TimelogEntity | undefined;
    }>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    private prepareCreatePayload;
    private prepareUpdatePayload;
    private applyStatusRules;
    private syncProgressByTaskTodoId;
    private syncTaskProgress;
    private getTodoStatusFromTimelog;
    private getTodoProgress;
    private withTimelogFile;
    private emitEstimateAlerts;
    private isTimelogOverEstimate;
    private formatEstimateTime;
}
