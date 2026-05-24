import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../../common/responses/api-response.util';
import { removePasswords } from '../../../common/serialization/remove-passwords.util';
import { TaskEntity, UserEntity } from '../../../database/entities';
import { NotificationEntity } from '../entities/notification.entity';
import { CreateNotificationRequest } from '../dto/create-notification.dto';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.type';
import { RealtimeService } from '../../realtime/realtime.service';

export const TASK_CREATED_EVENT = 'task.created';
export const TASK_STATUS_UPDATED_EVENT = 'task.status.updated';

export type TaskCreatedEvent = {
  task_id: number;
};

export type TaskStatusUpdatedEvent = {
  task_id: number;
  previous_status: string;
  current_status: string;
  updated_by?: number | null;
};

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(payload: CreateNotificationRequest) {
    const task = await this.findTask(payload.task_id);
    return successResponse(
      'Notification Created',
      'Notification created successfully',
      await this.createForTaskStatus(task, {
        title: payload.title,
        message: payload.message,
      }),
    );
  }

  findAll(user: AuthenticatedUser) {
    if (this.canReadAll(user)) {
      return this.notificationRepository
        .find({
          relations: { task: { user: true }, user: true },
          order: { created_at: 'DESC' },
        })
        .then((notifications) =>
          successResponse(
            'Notifications Retrieved',
            'Notifications retrieved successfully',
            removePasswords(notifications),
          ),
        );
    }

    return this.notificationRepository
      .find({
        where: { user_id: user.id },
        relations: { task: { user: true }, user: true },
        order: { created_at: 'DESC' },
      })
      .then((notifications) =>
        successResponse(
          'Notifications Retrieved',
          'Notifications retrieved successfully',
          removePasswords(notifications),
        ),
      );
  }

  findMine(user: AuthenticatedUser) {
    return this.notificationRepository
      .find({
        where: { user_id: user.id },
        relations: { task: { user: true }, user: true },
        order: { created_at: 'DESC' },
      })
      .then((notifications) =>
        successResponse(
          'Notifications Retrieved',
          'Notifications retrieved successfully',
          removePasswords(notifications),
        ),
      );
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const notification = await this.notificationRepository.findOne({
      where: this.canReadAll(user) ? { id } : { id, user_id: user.id },
      relations: { task: { user: true }, user: true },
    });

    if (!notification) {
      throw new NotFoundException(
        errorResponse(
          'Notification Not Found',
          `Notification ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Notification Retrieved',
      'Notification retrieved successfully',
      removePasswords(notification),
    );
  }

  async markAsRead(id: number, user: AuthenticatedUser) {
    const notification = responseData(await this.findOne(id, user));
    notification.is_read = true;
    return successResponse(
      'Notification Updated',
      'Notification marked as read successfully',
      await this.notificationRepository.save(notification),
    );
  }

  @OnEvent(TASK_CREATED_EVENT)
  async handleTaskCreated(payload: TaskCreatedEvent) {
    const task = await this.findTask(payload.task_id);
    return this.createForTaskStatus(task, {
      title: 'New Task',
      message: `Task "${task.title}" created with status ${task.status}.`,
    });
  }

  @OnEvent(TASK_STATUS_UPDATED_EVENT)
  async handleTaskStatusUpdated(payload: TaskStatusUpdatedEvent) {
    const task = await this.findTask(payload.task_id);
    return this.createForTaskStatus(task, {
      title: 'Task Status Updated',
      message: `Task "${task.title}" status changed from ${payload.previous_status} to ${payload.current_status}.`,
    });
  }

  private async findTask(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(
        errorResponse('Task Not Found', `Task ${taskId} was not found`),
      );
    }

    return task;
  }

  private async createForTaskStatus(
    task: TaskEntity,
    override?: { title?: string; message?: string },
  ) {
    const recipientIds = await this.getTaskRecipientIds(task);
    if (recipientIds.length === 0) {
      return [];
    }

    const users = await this.userRepository.find({
      where: { id: In(recipientIds) },
      select: { id: true },
    });

    const notifications = users.map((user) =>
      this.notificationRepository.create({
        task_id: task.id,
        user_id: user.id,
        title: override?.title ?? 'Task Status Updated',
        message:
          override?.message ??
          `Task "${task.title}" is currently ${task.status}.`,
        is_read: false,
      }),
    );

    const savedNotifications =
      await this.notificationRepository.save(notifications);

    savedNotifications.forEach((notification) => {
      this.realtimeService.emitToUser(
        notification.user_id,
        'notification.created',
        removePasswords(notification),
      );
    });

    return savedNotifications;
  }

  private getTaskRecipientIds(task: TaskEntity) {
    return [
      ...new Set([task.user_id, ...(task.assignee_user_ids ?? [])]),
    ].filter((userId) => Number.isInteger(userId) && userId > 0);
  }

  private canReadAll(user: AuthenticatedUser) {
    return user.role === 'admin' || user.role === 'manager';
  }
}
