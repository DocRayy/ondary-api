import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response } from 'express';
import { DataSource, In, Repository } from 'typeorm';
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
  UserEntity,
} from '../../database/entities';
import {
  generatePdf,
  normalizeReportMonth,
  type TaskReportPdfData,
  type TaskReportRow,
} from '../../cores/helpers/pdf-helper';
import {
  TASK_CREATED_EVENT,
  TASK_STATUS_UPDATED_EVENT,
  TaskCreatedEvent,
  TaskStatusUpdatedEvent,
} from '../notification/public/notification.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskRequest, MoveTaskRequest, UpdateTaskRequest } from './dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskTodoEntity)
    private readonly taskTodosRepository: Repository<TaskTodoEntity>,
    @InjectRepository(TimelogEntity)
    private readonly timelogsRepository: Repository<TimelogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly realtimeService: RealtimeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateTaskRequest, currentUserId?: number) {
    const status = payload.status ?? 'draft';
    const orderIndex =
      payload.order_index ??
      (await this.getNextOrderIndex(
        payload.project_id,
        payload.board_column ?? status,
      ));
    const task = await this.taskRepository.save(
      this.taskRepository.create({
        ...payload,
        status,
        created_by: currentUserId ?? payload.created_by ?? null,
        assignee_user_ids: this.normalizeUserIds(payload.assignee_user_ids),
        board_column: payload.board_column ?? status,
        order_index: orderIndex,
      }),
    );

    const taskWithAssignees = responseData(await this.findOne(task.id));
    this.realtimeService.emitToProject(
      task.project_id,
      'task.created',
      taskWithAssignees,
    );
    this.eventEmitter.emit(TASK_CREATED_EVENT, {
      task_id: task.id,
    } satisfies TaskCreatedEvent);
    return successResponse(
      'Task Created',
      'Task created successfully',
      removePasswords(taskWithAssignees),
    );
  }

  async findAll(userId?: number) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.updatedBy', 'updatedBy')
      .leftJoinAndSelect('task.taskTodo', 'taskTodo')
      .orderBy('task.order_index', 'ASC')
      .addOrderBy('task.id', 'DESC');

    if (userId && Number.isInteger(userId)) {
      query.where(
        `(task.user_id = :userId
          OR JSON_CONTAINS(task.assignee_user_ids, :assigneeUserId)
          OR JSON_CONTAINS(task.assignee_user_ids, :assigneeUserIdAsString))`,
        {
          userId,
          assigneeUserId: String(userId),
          assigneeUserIdAsString: JSON.stringify(String(userId)),
        },
      );
    }

    return successResponse(
      'Tasks Retrieved',
      'Tasks retrieved successfully',
      removePasswords(await this.attachAssigneeUsers(await query.getMany())),
    );
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        user: true,
        createdBy: true,
        updatedBy: true,
        taskTodo: { user: true },
        todos: { user: true, createdBy: true, updatedBy: true },
      },
    });
    if (!task) {
      throw new NotFoundException(
        errorResponse('Task Not Found', `Task ${id} was not found`),
      );
    }

    return successResponse(
      'Task Retrieved',
      'Task retrieved successfully',
      removePasswords(await this.attachAssigneeUsers(task)),
    );
  }

  async generateTaskReport(
    res: Response,
    filters: { month?: string; year?: string; type?: string },
  ) {
    const reportMonth = normalizeReportMonth(filters.month, filters.year);
    const taskTodos = await this.taskTodosRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'todoUser')
      .leftJoinAndSelect('todo.task', 'task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect(
        'todo.timelogs',
        'timelog',
        `(
          (timelog.start >= :startDate AND timelog.start < :endDate)
          OR (timelog.end >= :startDate AND timelog.end < :endDate)
          OR (timelog.created_at >= :startDate AND timelog.created_at < :endDate)
          OR (timelog.updated_at >= :startDate AND timelog.updated_at < :endDate)
        )`,
        {
          startDate: reportMonth.startDate,
          endDate: reportMonth.endDate,
        },
      )
      .where(
        `(
          (todo.created_at >= :startDate AND todo.created_at < :endDate)
          OR (todo.finish_date >= :startDate AND todo.finish_date < :endDate)
          OR (todo.updated_at >= :startDate AND todo.updated_at < :endDate)
          OR timelog.id IS NOT NULL
        )`,
        {
          startDate: reportMonth.startDate,
          endDate: reportMonth.endDate,
        },
      )
      .orderBy('todo.created_at', 'DESC')
      .addOrderBy('todo.id', 'DESC');

    if (filters.type) {
      taskTodos.andWhere(
        '(todo.status = :type OR task.status = :type OR task.board_column = :type)',
        { type: filters.type },
      );
    }

    const timelogs = this.timelogsRepository
      .createQueryBuilder('timelog')
      .leftJoinAndSelect('timelog.user', 'timelogUser')
      .where('timelog.task_todo_id IS NULL')
      .andWhere(
        `(
          (timelog.start >= :startDate AND timelog.start < :endDate)
          OR (timelog.end >= :startDate AND timelog.end < :endDate)
          OR (timelog.created_at >= :startDate AND timelog.created_at < :endDate)
          OR (timelog.updated_at >= :startDate AND timelog.updated_at < :endDate)
        )`,
        {
          startDate: reportMonth.startDate,
          endDate: reportMonth.endDate,
        },
      )
      .orderBy('timelog.created_at', 'DESC')
      .addOrderBy('timelog.id', 'DESC');

    if (filters.type) {
      timelogs.andWhere('timelog.status = :type', { type: filters.type });
    }

    const data = this.buildTaskReportData(
      await taskTodos.getMany(),
      reportMonth,
      await timelogs.getMany(),
    );
    const filename = `task-report-${reportMonth.year}-${String(
      reportMonth.month,
    ).padStart(2, '0')}.pdf`;

    return generatePdf(res, data, filename);
  }

  async update(id: number, payload: UpdateTaskRequest) {
    const currentTask = responseData(await this.findOne(id));
    const task = await this.taskRepository.preload({
      id,
      ...payload,
      assignee_user_ids:
        payload.assignee_user_ids === undefined
          ? undefined
          : this.normalizeUserIds(payload.assignee_user_ids),
      ...(payload.status && !payload.board_column
        ? { board_column: payload.status }
        : {}),
      ...(payload.status === 'completed' && !payload.completed_at
        ? { completed_at: new Date() }
        : {}),
    });
    if (!task) {
      throw new NotFoundException(
        errorResponse('Task Not Found', `Task ${id} was not found`),
      );
    }

    const savedTask = await this.taskRepository.save(task);
    const taskWithAssignees = await this.attachAssigneeUsers(savedTask);
    this.emitStatusUpdated(currentTask, savedTask, payload.updated_by);
    this.realtimeService.emitToProject(
      savedTask.project_id,
      'task.updated',
      taskWithAssignees,
    );
    return successResponse(
      'Task Updated',
      'Task updated successfully',
      removePasswords(taskWithAssignees),
    );
  }

  async move(id: number, payload: MoveTaskRequest, movedBy: number) {
    const task = responseData(await this.findOne(id));
    const movedAt = new Date();

    const movedTask = await this.dataSource.transaction(async (manager) => {
      const taskRepository = manager.getRepository(TaskEntity);
      await taskRepository
        .createQueryBuilder()
        .update(TaskEntity)
        .set({ order_index: () => 'order_index + 1' })
        .where('project_id = :projectId', { projectId: task.project_id })
        .andWhere('board_column = :boardColumn', {
          boardColumn: payload.status,
        })
        .andWhere('id != :taskId', { taskId: task.id })
        .andWhere('order_index >= :orderIndex', {
          orderIndex: payload.order_index,
        })
        .execute();

      const completedAt =
        payload.status === 'completed' ? (task.completed_at ?? movedAt) : null;
      const movementHistory = [
        ...(task.movement_history ?? []),
        {
          from_status: task.status,
          to_status: payload.status,
          from_order_index: task.order_index,
          to_order_index: payload.order_index,
          moved_by: movedBy,
          moved_at: movedAt.toISOString(),
        },
      ];

      await taskRepository.update(task.id, {
        status: payload.status,
        board_column: payload.status,
        order_index: payload.order_index,
        moved_at: movedAt,
        completed_at: completedAt,
        updated_by: movedBy,
        movement_history: movementHistory,
      });

      return taskRepository.findOneOrFail({ where: { id: task.id } });
    });

    this.emitStatusUpdated(task, movedTask, movedBy);
    const movedTaskWithAssignees = await this.attachAssigneeUsers(movedTask);
    this.realtimeService.emitToProject(movedTask.project_id, 'task.moved', {
      task: movedTaskWithAssignees,
      moved_by: movedBy,
    });
    this.realtimeService.emitToProject(
      movedTask.project_id,
      'dashboard.refresh',
      { project_id: movedTask.project_id },
    );

    return successResponse(
      'Task Moved',
      'Task moved successfully',
      removePasswords(movedTaskWithAssignees),
    );
  }

  async remove(id: number) {
    const task = responseData(await this.findOne(id));
    await this.taskRepository.delete(task.id);
    this.realtimeService.emitToProject(task.project_id, 'task.deleted', {
      id: task.id,
      project_id: task.project_id,
    });
    return successResponse('Task Deleted', 'Task deleted successfully');
  }

  private async getNextOrderIndex(projectId: number, boardColumn: string) {
    const result = await this.taskRepository
      .createQueryBuilder('task')
      .select('MAX(task.order_index)', 'max')
      .where('task.project_id = :projectId', { projectId })
      .andWhere('task.board_column = :boardColumn', { boardColumn })
      .getRawOne<{ max: string | null }>();

    return Number(result?.max ?? -1) + 1;
  }

  private emitStatusUpdated(
    currentTask: TaskEntity,
    savedTask: TaskEntity,
    updatedBy?: number | null,
  ) {
    if (currentTask.status === savedTask.status) {
      return;
    }

    this.eventEmitter.emit(TASK_STATUS_UPDATED_EVENT, {
      task_id: savedTask.id,
      previous_status: currentTask.status,
      current_status: savedTask.status,
      updated_by: updatedBy,
    } satisfies TaskStatusUpdatedEvent);
  }

  private async attachAssigneeUsers(task: TaskEntity): Promise<TaskEntity>;
  private async attachAssigneeUsers(tasks: TaskEntity[]): Promise<TaskEntity[]>;
  private async attachAssigneeUsers(
    taskOrTasks: TaskEntity | TaskEntity[],
  ): Promise<TaskEntity | TaskEntity[]> {
    const tasks = Array.isArray(taskOrTasks) ? taskOrTasks : [taskOrTasks];
    const assigneeIds = [
      ...new Set(
        tasks.flatMap((task) => this.normalizeUserIds(task.assignee_user_ids)),
      ),
    ];

    const users =
      assigneeIds.length > 0
        ? await this.userRepository.find({
            where: { id: In(assigneeIds) },
          })
        : [];
    const usersById = new Map(users.map((user) => [user.id, user]));

    const mappedTasks = tasks.map((task) => {
      const assigneeUserIds = this.normalizeUserIds(task.assignee_user_ids);
      const assigneeUsers = assigneeUserIds
        .map((userId) => usersById.get(userId))
        .filter(Boolean);

      return Object.assign(task, {
        user: assigneeUsers,
        assignee_user_ids: assigneeUserIds,
        assignee_users: assigneeUsers,
      });
    });

    return Array.isArray(taskOrTasks) ? mappedTasks : mappedTasks[0];
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

  private buildTaskReportData(
    taskTodos: TaskTodoEntity[],
    reportMonth: ReturnType<typeof normalizeReportMonth>,
    timelogs: TimelogEntity[] = [],
  ): TaskReportPdfData {
    const rows = [
      ...taskTodos.map((todo) =>
        this.buildTodoReportRow(
          todo,
          reportMonth.startDate,
          reportMonth.endDate,
        ),
      ),
      ...timelogs.map((timelog) =>
        this.buildTimelogReportRow(
          timelog,
          reportMonth.startDate,
          reportMonth.endDate,
        ),
      ),
    ].sort(
      (first, second) =>
        first.reportDate.getTime() - second.reportDate.getTime(),
    );
    const reportRows = rows.map(({ reportDate: _reportDate, ...row }) => row);
    const projectNames = new Set(
      reportRows.map((row) => row.project).filter((project) => project !== '-'),
    );

    return {
      month: reportMonth.month,
      year: reportMonth.year,
      monthName: reportMonth.monthName,
      totalTimeSpendMinutes: reportRows.reduce(
        (total, row) => total + row.timeSpendMinutes,
        0,
      ),
      totalTodos: reportRows.length,
      totalProjects: projectNames.size,
      totalCompleted: reportRows.reduce(
        (total, row) => total + row.completed,
        0,
      ),
      rows: reportRows,
    };
  }

  private buildTodoReportRow(
    todo: TaskTodoEntity,
    startDate: Date,
    endDate: Date,
  ): TaskReportRow & { reportDate: Date } {
    const timeSpendMinutes = (todo.timelogs ?? []).reduce(
      (total, timelog) => total + this.getTimelogMinutes(timelog),
      0,
    );
    const completedDate = todo.finish_date ?? todo.task?.completed_at ?? null;
    const reportDate = this.getReportRowDate(todo, startDate, endDate);
    const isCompleted =
      this.isDateInRange(completedDate, startDate, endDate) &&
      (todo.progress >= 100 ||
        ['finish', 'finished', 'completed'].includes(todo.status));

    return {
      assignee: todo.user?.name || todo.user?.username || 'Unassigned',
      todo: todo.label,
      status: todo.status,
      created: this.isDateInRange(todo.created_at, startDate, endDate) ? 1 : 0,
      completed: isCompleted ? 1 : 0,
      project: todo.task?.project?.label ?? '-',
      timeSpendMinutes,
      createdAt: this.formatReportDateTime(todo.created_at),
      groupWeek: this.getWeekOfMonth(reportDate),
      groupDay: this.formatReportDay(reportDate),
      reportDate,
    };
  }

  private buildTimelogReportRow(
    timelog: TimelogEntity,
    startDate: Date,
    endDate: Date,
  ): TaskReportRow & { reportDate: Date } {
    const reportDate = this.getTimelogReportDate(timelog, startDate, endDate);

    return {
      assignee: timelog.user?.name || timelog.user?.username || 'Unassigned',
      todo: timelog.name,
      status: timelog.status,
      created: this.isDateInRange(timelog.created_at, startDate, endDate)
        ? 1
        : 0,
      completed:
        this.isDateInRange(timelog.end, startDate, endDate) ||
        ['finish', 'finished', 'completed', 'done'].includes(timelog.status)
          ? 1
          : 0,
      project: '-',
      timeSpendMinutes: this.getTimelogMinutes(timelog),
      createdAt: this.formatReportDateTime(timelog.created_at),
      groupWeek: this.getWeekOfMonth(reportDate),
      groupDay: this.formatReportDay(reportDate),
      reportDate,
    };
  }

  private getTimelogMinutes(timelog: TimelogEntity) {
    if (typeof timelog.minuted_logged === 'number') {
      return timelog.minuted_logged;
    }

    const parsedTime = this.parseDurationToMinutes(timelog.time);
    if (parsedTime > 0) {
      return parsedTime;
    }

    if (timelog.start && timelog.end) {
      return Math.max(
        0,
        Math.floor((timelog.end.getTime() - timelog.start.getTime()) / 60000),
      );
    }

    return 0;
  }

  private parseDurationToMinutes(value: string | null) {
    if (!value) {
      return 0;
    }

    const hourMinuteMatch = value.match(/^(\d+):(\d{1,2})$/);
    if (hourMinuteMatch) {
      return Number(hourMinuteMatch[1]) * 60 + Number(hourMinuteMatch[2]);
    }

    const hours = Number(value.match(/(\d+)\s*h/i)?.[1] ?? 0);
    const minutes = Number(value.match(/(\d+)\s*m/i)?.[1] ?? 0);

    return hours * 60 + minutes;
  }

  private isDateInRange(date: Date | null, startDate: Date, endDate: Date) {
    if (!date) {
      return false;
    }

    return date >= startDate && date < endDate;
  }

  private getReportRowDate(
    todo: TaskTodoEntity,
    startDate: Date,
    endDate: Date,
  ) {
    if (this.isDateInRange(todo.created_at, startDate, endDate)) {
      return todo.created_at;
    }

    const timelogDate = (todo.timelogs ?? [])
      .flatMap((timelog) => [
        timelog.created_at,
        timelog.start,
        timelog.end,
        timelog.updated_at,
      ])
      .filter((date): date is Date =>
        this.isDateInRange(date, startDate, endDate),
      )
      .sort((first, second) => first.getTime() - second.getTime())[0];

    return (
      timelogDate ??
      todo.finish_date ??
      todo.task?.completed_at ??
      todo.created_at
    );
  }

  private getTimelogReportDate(
    timelog: TimelogEntity,
    startDate: Date,
    endDate: Date,
  ) {
    return (
      [timelog.start, timelog.end, timelog.created_at, timelog.updated_at]
        .filter((date): date is Date =>
          this.isDateInRange(date, startDate, endDate),
        )
        .sort((first, second) => first.getTime() - second.getTime())[0] ??
      timelog.created_at
    );
  }

  private getWeekOfMonth(date: Date) {
    return Math.ceil(date.getDate() / 7);
  }

  private formatReportDay(date: Date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    });
  }

  private formatReportDateTime(date: Date | null) {
    if (!date) {
      return '-';
    }

    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
