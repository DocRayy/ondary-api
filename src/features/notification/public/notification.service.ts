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
import {
  ManagerNoteEntity,
  TaskEntity,
  TaskTodoEntity,
  UserEntity,
} from '../../../database/entities';
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
          relations: {
            task: { user: true },
            taskTodo: { user: true },
            managerNote: true,
            user: true,
          },
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
        relations: {
          task: { user: true },
          taskTodo: { user: true },
          managerNote: true,
          user: true,
        },
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

  async createForTaskTodoCreated(
    taskTodo: TaskTodoEntity,
    task: TaskEntity,
    recipientIds?: number[],
  ) {
    const todoRecipientIds = recipientIds?.length
      ? recipientIds
      : taskTodo.user_id
        ? [taskTodo.user_id]
        : [];

    if (todoRecipientIds.length === 0) {
      return [];
    }

    return this.createForUsers(todoRecipientIds, {
      type: 'task_todo_created',
      task_id: task.id,
      task_todo_id: taskTodo.id,
      title: 'New Task Todo',
      message: `Todo "${taskTodo.label}" was added to task "${task.title}".`,
    });
  }

  async createForManagerNoteCreated(managerNote: ManagerNoteEntity) {
    return this.createForUsers([managerNote.user_id], {
      type: 'manager_note_created',
      manager_note_id: managerNote.id,
      title: 'New Manager Note',
      message: `Manager note "${managerNote.title}" was created for you.`,
    });
  }

  async createForTaskCommentMention(task: TaskEntity, recipientIds: number[]) {
    return this.createForUsers(recipientIds, {
      type: 'task_comment_mention',
      task_id: task.id,
      title: 'Task Comment Mention',
      message: `You were mentioned in a comment on task "${task.title}".`,
    });
  }

  findMine(user: AuthenticatedUser) {
    return this.notificationRepository
      .find({
        where: { user_id: user.id },
        relations: {
          task: { user: true },
          taskTodo: { user: true },
          managerNote: true,
          user: true,
        },
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
      relations: {
        task: { user: true },
        taskTodo: { user: true },
        managerNote: true,
        user: true,
      },
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
      type: 'task_created',
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
    override?: { title?: string; message?: string; type?: string },
  ) {
    const recipientIds = await this.getTaskRecipientIds(task);
    if (recipientIds.length === 0) {
      return [];
    }

    return this.createForUsers(recipientIds, {
      type: override?.type ?? 'task_status_updated',
      task_id: task.id,
      title: override?.title ?? 'Task Status Updated',
      message:
        override?.message ??
        `Task "${task.title}" is currently ${task.status}.`,
    });
  }

  private async createForUsers(
    recipientIds: number[],
    payload: {
      type: string;
      title: string;
      message: string;
      task_id?: number | null;
      task_todo_id?: number | null;
      manager_note_id?: number | null;
    },
  ) {
    const uniqueRecipientIds = [
      ...new Set(
        recipientIds.filter((userId) => Number.isInteger(userId) && userId > 0),
      ),
    ];

    if (uniqueRecipientIds.length === 0) {
      return [];
    }

    const users = await this.userRepository.find({
      where: { id: In(uniqueRecipientIds) },
      select: { id: true },
    });

    const notifications = users.map((user) =>
      this.notificationRepository.create({
        task_id: payload.task_id ?? null,
        task_todo_id: payload.task_todo_id ?? null,
        manager_note_id: payload.manager_note_id ?? null,
        user_id: user.id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
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
