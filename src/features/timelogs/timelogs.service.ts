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
  TimelogEntity,
} from '../../database/entities';
import { CreateTimelogRequest, UpdateTimelogRequest } from './dto';

@Injectable()
export class TimelogsService {
  constructor(
    @InjectRepository(TimelogEntity)
    private readonly timelogsRepository: Repository<TimelogEntity>,
    @InjectRepository(TaskTodoEntity)
    private readonly taskTodosRepository: Repository<TaskTodoEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(payload: CreateTimelogRequest) {
    const timelog = await this.timelogsRepository.save(
      this.timelogsRepository.create(this.prepareCreatePayload(payload)),
    );
    await this.syncProgressByTaskTodoId(timelog.task_todo_id);
    return successResponse(
      'Timelog Created',
      'Timelog created successfully',
      responseData(await this.findOne(timelog.id)),
    );
  }

  findAll() {
    return this.timelogsRepository
      .find({
        relations: {
          user: true,
          taskTodo: { task: { user: true }, user: true },
          files: true,
        },
        order: { id: 'DESC' },
      })
      .then((timelogs) =>
        successResponse(
          'Timelogs Retrieved',
          'Timelogs retrieved successfully',
          this.withTimelogFile(removePasswords(timelogs)),
        ),
      );
  }

  async findOne(id: number) {
    const timelog = await this.timelogsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        taskTodo: { task: { user: true }, user: true },
        files: true,
      },
    });
    if (!timelog) {
      throw new NotFoundException(
        errorResponse('Timelog Not Found', `Timelog ${id} was not found`),
      );
    }

    return successResponse(
      'Timelog Retrieved',
      'Timelog retrieved successfully',
      this.withTimelogFile(removePasswords(timelog)),
    );
  }

  async update(id: number, payload: UpdateTimelogRequest) {
    const currentTimelog = await this.timelogsRepository.findOne({
      where: { id },
    });
    if (!currentTimelog) {
      throw new NotFoundException(
        errorResponse('Timelog Not Found', `Timelog ${id} was not found`),
      );
    }

    const timelog = this.timelogsRepository.merge(
      currentTimelog,
      this.prepareUpdatePayload(currentTimelog, payload),
    );
    const savedTimelog = await this.timelogsRepository.save(timelog);
    await this.syncProgressByTaskTodoId(savedTimelog.task_todo_id);
    return successResponse(
      'Timelog Updated',
      'Timelog updated successfully',
      responseData(await this.findOne(savedTimelog.id)),
    );
  }

  async remove(id: number) {
    const timelog = await this.timelogsRepository.findOne({ where: { id } });
    if (!timelog) {
      throw new NotFoundException(
        errorResponse('Timelog Not Found', `Timelog ${id} was not found`),
      );
    }
    const taskTodoId = timelog.task_todo_id;
    await this.timelogsRepository.remove(timelog);
    await this.syncProgressByTaskTodoId(taskTodoId);
    return successResponse('Timelog Deleted', 'Timelog deleted successfully');
  }

  private prepareCreatePayload(payload: CreateTimelogRequest) {
    const status = payload.status ?? (payload.end ? 'pause' : 'active');

    return this.applyStatusRules({
      ...payload,
      status,
    });
  }

  private prepareUpdatePayload(
    currentTimelog: TimelogEntity,
    payload: UpdateTimelogRequest,
  ) {
    if (
      currentTimelog.status === 'finish' &&
      payload.status &&
      payload.status !== 'finish'
    ) {
      throw new BadRequestException(
        errorResponse(
          'Invalid Timelog Status',
          'A finished timelog cannot be changed back to active or paused',
        ),
      );
    }

    const nextStatus =
      payload.status ??
      (currentTimelog.status === 'finish'
        ? 'finish'
        : payload.end
          ? 'pause'
          : currentTimelog.status);

    return this.applyStatusRules({
      ...payload,
      status: nextStatus,
    });
  }

  private applyStatusRules<
    T extends CreateTimelogRequest | UpdateTimelogRequest,
  >(payload: T): T {
    if (payload.status === 'active') {
      return {
        ...payload,
        start: payload.start ?? new Date().toISOString(),
        end: undefined,
      };
    }

    if (payload.status === 'pause' || payload.status === 'finish') {
      return {
        ...payload,
        end: payload.end ?? new Date().toISOString(),
      };
    }

    return payload;
  }

  private async syncProgressByTaskTodoId(taskTodoId: number | null) {
    if (!taskTodoId) {
      return;
    }

    const taskTodo = await this.taskTodosRepository.findOne({
      where: { id: taskTodoId },
    });
    if (!taskTodo) {
      return;
    }

    const latestTimelog = await this.timelogsRepository.findOne({
      where: { task_todo_id: taskTodoId },
      order: { id: 'DESC' },
    });
    const todoStatus = this.getTodoStatusFromTimelog(latestTimelog);
    const todoProgress = this.getTodoProgress(todoStatus);

    await this.taskTodosRepository.update(taskTodoId, {
      status: todoStatus,
      progress: todoProgress,
    });
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

  private getTodoStatusFromTimelog(timelog: TimelogEntity | null) {
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

  private withTimelogFile<T extends TimelogEntity | TimelogEntity[]>(
    timelog: T,
  ): T {
    if (Array.isArray(timelog)) {
      return timelog.map((item) => this.withTimelogFile(item)) as T;
    }

    return {
      ...timelog,
      timelog_file: timelog.files ?? [],
    } as T;
  }
}
