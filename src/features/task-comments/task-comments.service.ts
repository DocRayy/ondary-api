import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import {
  TaskCommentEntity,
  TaskEntity,
  UserEntity,
} from '../../database/entities';
import { NotificationService } from '../notification/public/notification.service';
import { RealtimeService } from '../realtime/realtime.service';
import {
  CreateTaskCommentRequest,
  FindTaskCommentsQuery,
  UpdateTaskCommentRequest,
} from './dto';

@Injectable()
export class TaskCommentsService {
  constructor(
    @InjectRepository(TaskCommentEntity)
    private readonly taskCommentsRepository: Repository<TaskCommentEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly notificationService: NotificationService,
    private readonly realtimeService: RealtimeService,
  ) {}

  findAll(query: FindTaskCommentsQuery = {}) {
    return this.taskCommentsRepository
      .find({
        where: query.task_id ? { task_id: query.task_id } : undefined,
        relations: { user: true, task: true },
        order: { created_at: 'ASC', id: 'ASC' },
      })
      .then((comments) =>
        successResponse(
          'Task Comments Retrieved',
          'Task comments retrieved successfully',
          removePasswords(comments),
        ),
      );
  }

  async create(payload: CreateTaskCommentRequest, userId: number) {
    const task = await this.findTask(payload.task_id);
    await this.findUser(userId);

    const comment = await this.taskCommentsRepository.save(
      this.taskCommentsRepository.create({
        task_id: payload.task_id,
        user_id: userId,
        message: payload.message,
      }),
    );
    const commentWithUser = responseData(await this.findOne(comment.id));

    this.realtimeService.emitToProject(
      task.project_id,
      'task.comment.created',
      {
        task_id: task.id,
        comment: commentWithUser,
      },
    );

    await this.notifyMentionedUsers(payload.message, task, userId);

    return successResponse(
      'Task Comment Created',
      'Task comment created successfully',
      removePasswords(commentWithUser),
    );
  }

  async findOne(id: number) {
    const comment = await this.taskCommentsRepository.findOne({
      where: { id },
      relations: { user: true, task: true },
    });
    if (!comment) {
      throw new NotFoundException(
        errorResponse(
          'Task Comment Not Found',
          `Task comment ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Task Comment Retrieved',
      'Task comment retrieved successfully',
      removePasswords(comment),
    );
  }

  async update(id: number, payload: UpdateTaskCommentRequest) {
    const comment = await this.taskCommentsRepository.preload({
      id,
      ...payload,
    });
    if (!comment) {
      throw new NotFoundException(
        errorResponse(
          'Task Comment Not Found',
          `Task comment ${id} was not found`,
        ),
      );
    }

    const savedComment = await this.taskCommentsRepository.save(comment);
    const commentWithUser = responseData(await this.findOne(savedComment.id));
    this.realtimeService.emitToProject(
      commentWithUser.task.project_id,
      'task.comment.updated',
      {
        task_id: savedComment.task_id,
        comment: commentWithUser,
      },
    );

    return successResponse(
      'Task Comment Updated',
      'Task comment updated successfully',
      removePasswords(commentWithUser),
    );
  }

  async remove(id: number) {
    const comment = responseData(await this.findOne(id));
    await this.taskCommentsRepository.remove(comment);
    this.realtimeService.emitToProject(
      comment.task.project_id,
      'task.comment.deleted',
      {
        task_id: comment.task_id,
        id: comment.id,
      },
    );
    return successResponse(
      'Task Comment Deleted',
      'Task comment deleted successfully',
    );
  }

  private async notifyMentionedUsers(
    message: string,
    task: TaskEntity,
    senderUserId: number,
  ) {
    const usernames = this.extractMentionedUsernames(message);
    if (!usernames.length) {
      return [];
    }

    const users = await this.userRepository.find({
      where: { username: In(usernames) },
      select: { id: true, username: true },
    });
    const recipientIds = users
      .map((user) => user.id)
      .filter((userId) => userId !== senderUserId);

    return this.notificationService.createForTaskCommentMention(
      task,
      recipientIds,
    );
  }

  private extractMentionedUsernames(message: string) {
    return [
      ...new Set(
        Array.from(message.matchAll(/@([a-zA-Z0-9_.-]+)/g)).map(
          (match) => match[1],
        ),
      ),
    ];
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

  private async findUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        errorResponse('User Not Found', `User ${userId} was not found`),
      );
    }

    return user;
  }
}
