import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import {
  TaskEntity,
  TaskTodoEntity,
  TaskTodoUserEntity,
  UserEntity,
} from '../../database/entities';
import { NotificationService } from '../notification/public/notification.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskTodoRequest, UpdateTaskTodoRequest } from './dto';

@Injectable()
export class TaskTodosService {
  constructor(
    @InjectRepository(TaskTodoEntity)
    private readonly taskTodosRepository: Repository<TaskTodoEntity>,
    @InjectRepository(TaskTodoUserEntity)
    private readonly taskTodoUsersRepository: Repository<TaskTodoUserEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly realtimeService: RealtimeService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(payload: CreateTaskTodoRequest) {
    const task = await this.getTaskOrFail(payload.task_id);
    await this.requireManagerForManagerFields(payload, payload.created_by);
    const assignedUserIds = this.getRequestedTodoUserIds(payload);
    this.validateTodoUserAssignees(task, assignedUserIds);
    const { user_ids: _userIds, ...todoPayload } = payload;

    const taskTodo = await this.taskTodosRepository.save(
      this.taskTodosRepository.create({
        ...todoPayload,
        user_id: assignedUserIds[0] ?? payload.user_id ?? null,
        status: 'draft',
        progress: 0,
        created_by:
          payload.created_by ?? assignedUserIds[0] ?? payload.user_id ?? null,
      }),
    );
    await this.syncTodoUsers(taskTodo.id, assignedUserIds);

    if (!task.task_todo_id) {
      await this.taskRepository.update(task.id, { task_todo_id: taskTodo.id });
    }
    await this.syncTaskProgress(taskTodo.task_id);
    await this.notificationService.createForTaskTodoCreated(
      taskTodo,
      task,
      assignedUserIds,
    );

    return successResponse(
      'Task Todo Created',
      'Task todo created successfully',
      responseData(await this.findOne(taskTodo.id)),
    );
  }

  findAll() {
    return this.taskTodosRepository
      .find({
        relations: this.taskTodoRelations(),
        order: { id: 'DESC' },
      })
      .then((taskTodos) =>
        successResponse(
          'Task Todos Retrieved',
          'Task todos retrieved successfully',
          this.withTodoPresentation(removePasswords(taskTodos)),
        ),
      );
  }

  async findOne(id: number) {
    const taskTodo = await this.taskTodosRepository.findOne({
      where: { id },
      relations: this.taskTodoRelations(),
    });
    if (!taskTodo) {
      throw new NotFoundException(
        errorResponse('Task Todo Not Found', `Task todo ${id} was not found`),
      );
    }

    return successResponse(
      'Task Todo Retrieved',
      'Task todo retrieved successfully',
      this.withTodoPresentation(removePasswords(taskTodo)),
    );
  }

  async update(id: number, payload: UpdateTaskTodoRequest) {
    await this.requireManagerForManagerFields(
      payload,
      payload.updated_by,
      true,
    );
    const currentTaskTodo = await this.taskTodosRepository.findOne({
      where: { id },
      relations: { todoUsers: true },
    });
    if (!currentTaskTodo) {
      throw new NotFoundException(
        errorResponse('Task Todo Not Found', `Task todo ${id} was not found`),
      );
    }
    const assignedUserIds = this.getRequestedTodoUserIds(
      payload,
      currentTaskTodo,
    );
    const { user_ids: _userIds, ...todoPayload } = payload;
    const taskTodo = await this.taskTodosRepository.preload({
      id,
      ...todoPayload,
      user_id:
        payload.user_ids !== undefined
          ? (assignedUserIds[0] ?? null)
          : (payload.user_id ?? currentTaskTodo.user_id),
    });
    if (!taskTodo) {
      throw new NotFoundException(
        errorResponse('Task Todo Not Found', `Task todo ${id} was not found`),
      );
    }
    const task = await this.getTaskOrFail(taskTodo.task_id);
    this.validateTodoUserAssignees(task, assignedUserIds);

    const savedTaskTodo = await this.taskTodosRepository.save(taskTodo);
    if (payload.user_ids !== undefined || payload.user_id !== undefined) {
      await this.syncTodoUsers(savedTaskTodo.id, assignedUserIds);
    }
    await this.syncTaskTodoProgress(savedTaskTodo.id);

    this.realtimeService.emitToProject(task.project_id, 'todo.updated', {
      todo: savedTaskTodo,
    });

    return successResponse(
      'Task Todo Updated',
      'Task todo updated successfully',
      responseData(await this.findOne(savedTaskTodo.id)),
    );
  }

  async remove(id: number) {
    const taskTodo = await this.taskTodosRepository.findOne({ where: { id } });
    if (!taskTodo) {
      throw new NotFoundException(
        errorResponse('Task Todo Not Found', `Task todo ${id} was not found`),
      );
    }
    const taskId = taskTodo.task_id;
    await this.taskTodosRepository.remove(taskTodo);
    await this.syncTaskProgress(taskId);
    return successResponse(
      'Task Todo Deleted',
      'Task todo deleted successfully',
    );
  }

  private async syncTaskTodoProgress(taskTodoId: number) {
    const taskTodo = await this.taskTodosRepository.findOne({
      where: { id: taskTodoId },
      relations: { timelogs: true },
    });
    if (!taskTodo) {
      return;
    }

    const latestTimelog = [...(taskTodo.timelogs ?? [])].sort(
      (first, second) => second.id - first.id,
    )[0];
    const status = this.getTodoStatusFromTimelog(latestTimelog);
    const progress = this.getTodoProgress(status);

    await this.taskTodosRepository.update(taskTodoId, { status, progress });
    await this.syncTaskProgress(taskTodo.task_id);
  }

  private async syncTaskProgress(taskId: number) {
    const todos = await this.taskTodosRepository.find({
      where: { task_id: taskId },
      select: { progress: true },
    });
    const progress =
      todos.length === 0
        ? 0
        : Math.round(
            todos.reduce((total, todo) => total + (todo.progress ?? 0), 0) /
              todos.length,
          );

    await this.taskRepository.update(taskId, { progress });
  }

  private getTodoStatusFromTimelog(timelog?: { status: string }) {
    if (!timelog) {
      return 'draft';
    }

    if (timelog.status === 'finish') {
      return 'complete';
    }

    if (timelog.status === 'pause') {
      return 'break';
    }

    return 'pending';
  }

  private getTodoProgress(status: string) {
    if (status === 'complete' || status === 'completed_but_overdue') {
      return 100;
    }

    if (status === 'break') {
      return 50;
    }

    return 0;
  }

  private async getTaskOrFail(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(
        errorResponse('Task Not Found', `Task ${taskId} was not found`),
      );
    }

    return task;
  }

  private validateTodoUserAssignees(task: TaskEntity, userIds: number[]) {
    if (userIds.length === 0) {
      return;
    }

    const allowedUserIds = new Set([
      task.user_id,
      ...this.normalizeUserIds(task.assignee_user_ids),
    ]);

    const invalidUserId = userIds.find((userId) => !allowedUserIds.has(userId));
    if (invalidUserId) {
      throw new BadRequestException(
        errorResponse(
          'Invalid Task Todo Assignee',
          `User ${invalidUserId} is not assigned to task ${task.id}`,
        ),
      );
    }
  }

  private async requireManagerForManagerFields(
    payload: CreateTaskTodoRequest | UpdateTaskTodoRequest,
    actorId?: number,
    isUpdate = false,
  ) {
    const hasManagerOnlyField =
      payload.estimate_time !== undefined ||
      payload.user_ids !== undefined ||
      (isUpdate && payload.user_id !== undefined);

    if (!hasManagerOnlyField) {
      return;
    }

    if (!actorId) {
      throw new BadRequestException(
        errorResponse(
          'Manager Required',
          'created_by or updated_by is required to change todo estimate time or assignees',
        ),
      );
    }

    const actor = await this.userRepository.findOne({ where: { id: actorId } });
    if (!actor || (actor.role !== 'manager' && actor.role !== 'admin')) {
      throw new BadRequestException(
        errorResponse(
          'Manager Required',
          'Only manager can change todo estimate time or assignees',
        ),
      );
    }
  }

  private getRequestedTodoUserIds(
    payload: CreateTaskTodoRequest | UpdateTaskTodoRequest,
    currentTaskTodo?: TaskTodoEntity,
  ) {
    if (payload.user_ids !== undefined) {
      return this.normalizeUserIds(payload.user_ids);
    }

    if (payload.user_id !== undefined) {
      return this.normalizeUserIds([payload.user_id]);
    }

    if (currentTaskTodo?.todoUsers?.length) {
      return this.normalizeUserIds(
        currentTaskTodo.todoUsers.map((assignment) => assignment.user_id),
      );
    }

    return this.normalizeUserIds(currentTaskTodo?.user_id ?? null);
  }

  private async syncTodoUsers(taskTodoId: number, userIds: number[]) {
    await this.taskTodoUsersRepository.delete({ task_todo_id: taskTodoId });

    const uniqueUserIds = this.normalizeUserIds(userIds);
    if (uniqueUserIds.length === 0) {
      return;
    }

    await this.taskTodoUsersRepository.save(
      uniqueUserIds.map((userId) =>
        this.taskTodoUsersRepository.create({
          task_todo_id: taskTodoId,
          user_id: userId,
        }),
      ),
    );
  }

  private taskTodoRelations() {
    return {
      task: { user: true, createdBy: true, updatedBy: true },
      user: true,
      todoUsers: { user: true },
      createdBy: true,
      updatedBy: true,
      timelogs: { user: true },
    };
  }

  private withTodoPresentation<T extends TaskTodoEntity | TaskTodoEntity[]>(
    todo: T,
  ): T {
    if (Array.isArray(todo)) {
      return todo.map((item) => this.withTodoPresentation(item)) as T;
    }

    const users =
      todo.todoUsers
        ?.map((assignment) => assignment.user)
        .filter((user): user is UserEntity => Boolean(user)) ??
      (todo.user ? [todo.user] : []);
    const userIds = users.map((user) => user.id);

    return {
      ...todo,
      users,
      user_ids: userIds,
      estimate_time_hours: todo.estimate_time,
      estimate_time_minutes:
        todo.estimate_time === null || todo.estimate_time === undefined
          ? null
          : todo.estimate_time * 60,
      estimate_time_label: this.formatEstimateTime(todo.estimate_time),
    } as T;
  }

  private formatEstimateTime(hours?: number | null) {
    if (hours === null || hours === undefined) {
      return null;
    }

    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days}d`);
    }

    if (remainingHours > 0 || parts.length === 0) {
      parts.push(`${remainingHours}h`);
    }

    return parts.join(' ');
  }

  private normalizeUserIds(value: unknown) {
    if (!value) {
      return [];
    }

    const parsedValue =
      typeof value === 'string' ? this.parseUserIds(value) : value;
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return [
      ...new Set(
        parsedValue
          .map((userId) => Number(userId))
          .filter((userId) => Number.isInteger(userId) && userId > 0),
      ),
    ];
  }

  private parseUserIds(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      return value.split(',');
    }
  }
}
