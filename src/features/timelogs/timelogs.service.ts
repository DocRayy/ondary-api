import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
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
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTimelogRequest, UpdateTimelogRequest } from './dto';

@Injectable()
export class TimelogsService implements OnModuleInit, OnModuleDestroy {
  private readonly warningSentKeys = new Set<string>();
  private monitorInterval?: NodeJS.Timeout;

  constructor(
    @InjectRepository(TimelogEntity)
    private readonly timelogsRepository: Repository<TimelogEntity>,
    @InjectRepository(TaskTodoEntity)
    private readonly taskTodosRepository: Repository<TaskTodoEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly realtimeService: RealtimeService,
  ) {}

  onModuleInit() {
    this.monitorInterval = setInterval(() => {
      void this.emitEstimateAlerts();
    }, 60_000);
    void this.emitEstimateAlerts();
  }

  onModuleDestroy() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }

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
          taskTodo: {
            task: { user: true },
            user: true,
            todoUsers: { user: true },
          },
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
        taskTodo: {
          task: { user: true },
          user: true,
          todoUsers: { user: true },
        },
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
    const todoStatus = this.getTodoStatusFromTimelog(latestTimelog, taskTodo);
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

  private getTodoStatusFromTimelog(
    timelog: TimelogEntity | null,
    taskTodo?: TaskTodoEntity,
  ) {
    if (!timelog) {
      return 'draft';
    }

    if (timelog.status === 'finish') {
      if (taskTodo && this.isTimelogOverEstimate(timelog, taskTodo)) {
        return 'completed_but_overdue';
      }

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

  private async emitEstimateAlerts() {
    const activeTimelogs = await this.timelogsRepository.find({
      where: { status: 'active' },
      relations: { taskTodo: { task: true } },
    });
    const now = new Date();

    activeTimelogs.forEach((timelog) => {
      const taskTodo = timelog.taskTodo;
      if (!taskTodo?.estimate_time || !timelog.start) {
        return;
      }

      const estimateMinutes = taskTodo.estimate_time * 60;
      const elapsedMs = now.getTime() - new Date(timelog.start).getTime();
      const elapsedMinutes = Math.floor(elapsedMs / 60_000);
      const remainingMinutes = estimateMinutes - elapsedMinutes;
      const basePayload = {
        timelog_id: timelog.id,
        user_id: timelog.user_id,
        task_todo_id: taskTodo.id,
        task_id: taskTodo.task_id,
        task_title: taskTodo.task?.title ?? null,
        todo_label: taskTodo.label,
        estimate_time: taskTodo.estimate_time,
        estimate_time_minutes: estimateMinutes,
        estimate_time_label: this.formatEstimateTime(taskTodo.estimate_time),
        elapsed_minutes: elapsedMinutes,
      };

      if (elapsedMs > estimateMinutes * 60_000) {
        this.realtimeService.emitToUser(timelog.user_id, 'task_todo.overdue', {
          ...basePayload,
          title: 'Task Todo Overdue',
          message: `Todo "${taskTodo.label}" sudah melewati estimate time.`,
          overdue_minutes: elapsedMinutes - estimateMinutes,
        });
        return;
      }

      const warningKey = `${timelog.id}:10m`;
      if (
        remainingMinutes <= 10 &&
        remainingMinutes > 0 &&
        !this.warningSentKeys.has(warningKey)
      ) {
        this.warningSentKeys.add(warningKey);
        this.realtimeService.emitToUser(
          timelog.user_id,
          'task_todo.overdue_warning',
          {
            ...basePayload,
            title: 'Task Todo Almost Overdue',
            message: `Todo "${taskTodo.label}" akan overdue dalam ${remainingMinutes} menit.`,
            remaining_minutes: remainingMinutes,
          },
        );
      }
    });
  }

  private isTimelogOverEstimate(
    timelog: TimelogEntity,
    taskTodo: TaskTodoEntity,
  ) {
    if (!taskTodo.estimate_time || !timelog.start) {
      return false;
    }

    const end = timelog.end ? new Date(timelog.end) : new Date();
    const elapsedMs = end.getTime() - new Date(timelog.start).getTime();
    return elapsedMs > taskTodo.estimate_time * 60 * 60_000;
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
}
