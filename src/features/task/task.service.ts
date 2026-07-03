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
import { withPhotoUrl } from '../../common/uploads/media-url.util';
import {
  ProjectEntity,
  TaskEntity,
  TaskTodoEntity,
  TimelogEntity,
  UserEntity,
} from '../../database/entities';
import {
  calculateTaskReportPerformance,
  generatePdf,
  normalizeReportPeriod,
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
import {
  CreateTaskRequest,
  FindTasksQuery,
  MoveTaskRequest,
  UpdateTaskRequest,
} from './dto';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

type ReportPeriod = ReturnType<typeof normalizeReportPeriod> & {
  hasMonthFilter: boolean;
};

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
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
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
      withPhotoUrl(removePasswords(taskWithAssignees)),
    );
  }

  async findAll(filters: FindTasksQuery = {}) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.updatedBy', 'updatedBy')
      .leftJoinAndSelect('task.taskTodo', 'taskTodo')
      .leftJoinAndSelect('task.attachments', 'attachments')
      .orderBy('task.order_index', 'ASC')
      .addOrderBy('task.id', 'DESC');

    if (filters.user_id) {
      query.where(
        `(task.user_id = :userId
          OR JSON_CONTAINS(task.assignee_user_ids, :assigneeUserId)
          OR JSON_CONTAINS(task.assignee_user_ids, :assigneeUserIdAsString))`,
        {
          userId: filters.user_id,
          assigneeUserId: String(filters.user_id),
          assigneeUserIdAsString: JSON.stringify(String(filters.user_id)),
        },
      );
    }

    if (filters.project_id) {
      query.andWhere('task.project_id = :projectId', {
        projectId: filters.project_id,
      });
    }

    if (filters.month || filters.year) {
      const reportPeriod = normalizeReportPeriod(
        filters.month?.toString(),
        filters.year?.toString(),
      );
      query.andWhere(
        `(
          (task.created_at >= :startDate AND task.created_at < :endDate)
          OR (task.updated_at >= :startDate AND task.updated_at < :endDate)
          OR (task.due_date >= :startDate AND task.due_date < :endDate)
          OR (task.finish_date >= :startDate AND task.finish_date < :endDate)
          OR (task.completed_at >= :startDate AND task.completed_at < :endDate)
          OR (task.moved_at >= :startDate AND task.moved_at < :endDate)
        )`,
        {
          startDate: reportPeriod.startDate,
          endDate: reportPeriod.endDate,
        },
      );
    }

    if (filters.recently_updated_days) {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - filters.recently_updated_days);
      query.andWhere('task.moved_at >= :recentlyUpdatedSince', {
        recentlyUpdatedSince: sinceDate,
      });
    }

    return successResponse(
      'Tasks Retrieved',
      'Tasks retrieved successfully',
      withPhotoUrl(
        removePasswords(await this.attachAssigneeUsers(await query.getMany())),
      ),
    );
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        user: true,
        project: true,
        createdBy: true,
        updatedBy: true,
        taskTodo: { user: true },
        todos: { user: true, createdBy: true, updatedBy: true },
        attachments: true,
        comments: { user: true },
      },
      order: {
        attachments: { id: 'DESC' },
        comments: { created_at: 'ASC', id: 'ASC' },
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
      withPhotoUrl(removePasswords(await this.attachAssigneeUsers(task))),
    );
  }

  async generateTaskReport(
    res: Response,
    filters: {
      month?: string;
      year?: string;
      type?: string;
      user_id?: string;
      project_id?: string;
      current_user: AuthenticatedUser;
    },
  ) {
    const reportPeriod = this.normalizePdfReportPeriod(
      filters.month,
      filters.year,
    );
    const requestedUserId = Number(filters.user_id);
    const canReadAllReports = this.canReadAllReports(filters.current_user);
    const userId =
      canReadAllReports &&
      Number.isInteger(requestedUserId) &&
      requestedUserId > 0
        ? requestedUserId
        : canReadAllReports
          ? null
          : filters.current_user.id;
    const hasUserFilter = Number.isInteger(userId) && Number(userId) > 0;
    const projectId = Number(filters.project_id);
    const hasProjectFilter = Number.isInteger(projectId) && projectId > 0;
    const type = this.normalizeReportType(filters.type);
    const taskTodos = await this.taskTodosRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'todoUser')
      .leftJoinAndSelect('todo.todoUsers', 'todoAssignment')
      .leftJoinAndSelect('todoAssignment.user', 'assignedTodoUser')
      .leftJoinAndSelect('todo.task', 'task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect(
        'todo.timelogs',
        'timelog',
        `(
          (
            (timelog.start >= :startDate AND timelog.start < :endDate)
            OR (timelog.end >= :startDate AND timelog.end < :endDate)
            OR (timelog.created_at >= :startDate AND timelog.created_at < :endDate)
            OR (timelog.updated_at >= :startDate AND timelog.updated_at < :endDate)
          )
          AND (:reportUserId IS NULL OR timelog.user_id = :reportUserId)
        )`,
        {
          startDate: reportPeriod.startDate,
          endDate: reportPeriod.endDate,
          reportUserId: hasUserFilter ? userId : null,
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
          startDate: reportPeriod.startDate,
          endDate: reportPeriod.endDate,
        },
      )
      .orderBy('todo.created_at', 'DESC')
      .addOrderBy('todo.id', 'DESC');

    if (type) {
      taskTodos.andWhere(
        '(todo.status = :type OR task.status = :type OR task.board_column = :type)',
        { type },
      );
    }

    if (hasUserFilter) {
      taskTodos.andWhere(
        `(
          todo.user_id = :userId
          OR todoAssignment.user_id = :userId
          OR timelog.user_id = :userId
        )`,
        { userId },
      );
    }

    if (hasProjectFilter) {
      taskTodos.andWhere('task.project_id = :projectId', { projectId });
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
          startDate: reportPeriod.startDate,
          endDate: reportPeriod.endDate,
        },
      )
      .orderBy('timelog.created_at', 'DESC')
      .addOrderBy('timelog.id', 'DESC');

    if (type) {
      timelogs.andWhere('timelog.status = :type', { type });
    }

    if (hasUserFilter) {
      timelogs.andWhere('timelog.user_id = :userId', { userId });
    }

    if (hasProjectFilter) {
      timelogs.andWhere('1 = 0');
    }

    const data = this.buildTaskReportData(
      await taskTodos.getMany(),
      reportPeriod,
      await timelogs.getMany(),
      await this.buildReportFilterSummary({
        reportPeriod,
        hasMonthFilter: reportPeriod.hasMonthFilter,
        projectId: hasProjectFilter ? projectId : null,
        userId: hasUserFilter ? Number(userId) : null,
        currentUser: filters.current_user,
        canReadAllReports,
        type,
      }),
    );
    const filenameMonth = reportPeriod.month
      ? `-${String(reportPeriod.month).padStart(2, '0')}`
      : '';
    const filenameUser = hasUserFilter ? `-user-${userId}` : '';
    const filenameProject = hasProjectFilter ? `-project-${projectId}` : '';
    const filename = `task-report-${reportPeriod.year}${filenameMonth}${filenameUser}${filenameProject}.pdf`;

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
      ...(payload.status && payload.status !== currentTask.status
        ? { moved_at: new Date() }
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
      withPhotoUrl(removePasswords(taskWithAssignees)),
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
      withPhotoUrl(removePasswords(movedTaskWithAssignees)),
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

  private canReadAllReports(user: AuthenticatedUser) {
    return user.role === 'manager' || user.role === 'admin';
  }

  private normalizePdfReportPeriod(
    month?: string,
    year?: string,
  ): ReportPeriod {
    const parsedMonth = Number(month);
    const parsedYear = Number(year);
    const hasMonthFilter =
      month !== undefined &&
      month !== '' &&
      !['all', 'all_months', 'all-months', 'all months'].includes(
        month.trim().toLowerCase(),
      ) &&
      Number.isInteger(parsedMonth) &&
      parsedMonth >= 1 &&
      parsedMonth <= 12;
    const selectedYear =
      Number.isInteger(parsedYear) && parsedYear > 1900
        ? parsedYear
        : new Date().getFullYear();

    if (hasMonthFilter) {
      return {
        ...normalizeReportPeriod(String(parsedMonth), String(selectedYear)),
        hasMonthFilter: true,
      };
    }

    const startDate = new Date(selectedYear, 0, 1, 0, 0, 0, 0);
    const endDate = new Date(selectedYear + 1, 0, 1, 0, 0, 0, 0);

    return {
      month: null,
      year: selectedYear,
      monthName: null,
      periodLabel: String(selectedYear),
      startDate,
      endDate,
      hasMonthFilter: false,
    };
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
    reportPeriod: ReportPeriod,
    timelogs: TimelogEntity[] = [],
    filterSummary: TaskReportPdfData['filterSummary'],
  ): TaskReportPdfData {
    const rows = [
      ...taskTodos.map((todo) =>
        this.buildTodoReportRow(
          todo,
          reportPeriod.startDate,
          reportPeriod.endDate,
        ),
      ),
      ...timelogs.map((timelog) =>
        this.buildTimelogReportRow(
          timelog,
          reportPeriod.startDate,
          reportPeriod.endDate,
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
    const totalTimeSpendMinutes = reportRows.reduce(
      (total, row) => total + row.timeSpendMinutes,
      0,
    );
    const totalTodos = reportRows.length;
    const totalProjects = projectNames.size;
    const totalCompleted = reportRows.reduce(
      (total, row) => total + row.completed,
      0,
    );
    const performance = calculateTaskReportPerformance({
      totalTimeSpendMinutes,
      totalTodos,
      totalProjects,
      totalCompleted,
    });

    return {
      month: reportPeriod.month,
      year: reportPeriod.year,
      monthName: reportPeriod.monthName,
      periodLabel: reportPeriod.periodLabel,
      filterSummary,
      totalTimeSpendMinutes,
      totalTodos,
      totalProjects,
      totalCompleted,
      performanceTitle: performance.title,
      performanceSubtitle: performance.subtitle,
      performanceScore: performance.score,
      groupByMonth: !reportPeriod.hasMonthFilter,
      rows: reportRows,
    };
  }

  private async buildReportFilterSummary(filters: {
    reportPeriod: ReportPeriod;
    hasMonthFilter: boolean;
    projectId: number | null;
    userId: number | null;
    currentUser: AuthenticatedUser;
    canReadAllReports: boolean;
    type: string | null;
  }): Promise<TaskReportPdfData['filterSummary']> {
    const [project, selectedUser] = await Promise.all([
      filters.projectId
        ? this.projectRepository.findOne({ where: { id: filters.projectId } })
        : Promise.resolve(null),
      filters.userId
        ? this.userRepository.findOne({ where: { id: filters.userId } })
        : Promise.resolve(null),
    ]);

    return {
      month: filters.hasMonthFilter
        ? (filters.reportPeriod.monthName ?? 'All Months')
        : 'All Months',
      year: String(filters.reportPeriod.year),
      project: project?.label ?? 'All Projects',
      user: filters.userId
        ? this.getUserDisplayName(selectedUser)
        : filters.canReadAllReports
          ? 'All Users'
          : this.getUserDisplayName(filters.currentUser),
      type: filters.type ? this.formatReportType(filters.type) : 'All Types',
    };
  }

  private normalizeReportType(value?: string) {
    const type = value?.trim();
    return type ? type : null;
  }

  private formatReportType(value: string) {
    return value
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private getUserDisplayName(
    user: Pick<UserEntity, 'name' | 'username'> | AuthenticatedUser | null,
  ) {
    return user?.name || user?.username || 'Unknown User';
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
        [
          'finish',
          'finished',
          'complete',
          'completed',
          'completed_but_overdue',
        ].includes(todo.status));

    return {
      assignee: this.getTodoAssigneeLabel(todo),
      todo: todo.label,
      status: todo.status,
      created: this.isDateInRange(todo.created_at, startDate, endDate) ? 1 : 0,
      completed: isCompleted ? 1 : 0,
      project: todo.task?.project?.label ?? '-',
      timeSpendMinutes,
      createdAt: this.formatReportDateTime(todo.created_at),
      groupMonth: this.formatReportMonth(reportDate),
      groupWeek: this.getWeekOfMonth(reportDate),
      groupDay: this.formatReportDay(reportDate),
      reportDate,
    };
  }

  private getTodoAssigneeLabel(todo: TaskTodoEntity) {
    const assignedUsers =
      todo.todoUsers
        ?.map((assignment) => assignment.user)
        .filter((user): user is UserEntity => Boolean(user)) ?? [];

    if (assignedUsers.length > 0) {
      return assignedUsers
        .map((user) => user.name || user.username)
        .filter(Boolean)
        .join(', ');
    }

    return todo.user?.name || todo.user?.username || 'Unassigned';
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
      groupMonth: this.formatReportMonth(reportDate),
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

  private formatReportMonth(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
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
