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
import { TaskEntity, TaskTodoEntity } from '../../database/entities';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskTodoRequest, UpdateTaskTodoRequest } from './dto';

@Injectable()
export class TaskTodosService {
  constructor(
    @InjectRepository(TaskTodoEntity)
    private readonly taskTodosRepository: Repository<TaskTodoEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(payload: CreateTaskTodoRequest) {
    const task = await this.getTaskOrFail(payload.task_id);
    this.validateTodoUserAssignee(task, payload.user_id);

    const taskTodo = await this.taskTodosRepository.save(
      this.taskTodosRepository.create({
        ...payload,
        status: 'draft',
        progress: 0,
        created_by: payload.created_by ?? payload.user_id ?? null,
      }),
    );

    if (!task.task_todo_id) {
      await this.taskRepository.update(task.id, { task_todo_id: taskTodo.id });
    }
    await this.syncTaskProgress(taskTodo.task_id);

    return successResponse(
      'Task Todo Created',
      'Task todo created successfully',
      responseData(await this.findOne(taskTodo.id)),
    );
  }

  findAll() {
    return this.taskTodosRepository
      .find({
        relations: {
          task: { user: true, createdBy: true, updatedBy: true },
          user: true,
          createdBy: true,
          updatedBy: true,
          timelogs: { user: true },
        },
        order: { id: 'DESC' },
      })
      .then((taskTodos) =>
        successResponse(
          'Task Todos Retrieved',
          'Task todos retrieved successfully',
          removePasswords(taskTodos),
        ),
      );
  }

  async findOne(id: number) {
    const taskTodo = await this.taskTodosRepository.findOne({
      where: { id },
      relations: {
        task: { user: true, createdBy: true, updatedBy: true },
        user: true,
        createdBy: true,
        updatedBy: true,
        timelogs: { user: true },
      },
    });
    if (!taskTodo) {
      throw new NotFoundException(
        errorResponse('Task Todo Not Found', `Task todo ${id} was not found`),
      );
    }

    return successResponse(
      'Task Todo Retrieved',
      'Task todo retrieved successfully',
      removePasswords(taskTodo),
    );
  }

  async update(id: number, payload: UpdateTaskTodoRequest) {
    const taskTodo = await this.taskTodosRepository.preload({ id, ...payload });
    if (!taskTodo) {
      throw new NotFoundException(
        errorResponse('Task Todo Not Found', `Task todo ${id} was not found`),
      );
    }
    const task = await this.getTaskOrFail(taskTodo.task_id);
    this.validateTodoUserAssignee(task, taskTodo.user_id);

    const savedTaskTodo = await this.taskTodosRepository.save(taskTodo);
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
    if (status === 'complete') {
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

  private validateTodoUserAssignee(task: TaskEntity, userId?: number | null) {
    if (!userId) {
      return;
    }

    const allowedUserIds = new Set([
      task.user_id,
      ...this.normalizeUserIds(task.assignee_user_ids),
    ]);

    if (!allowedUserIds.has(userId)) {
      throw new BadRequestException(
        errorResponse(
          'Invalid Task Todo Assignee',
          `User ${userId} is not assigned to task ${task.id}`,
        ),
      );
    }
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
