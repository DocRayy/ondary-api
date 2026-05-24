import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { TaskUserEntity } from '../../database/entities';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskUserRequest, UpdateTaskUserRequest } from './dto';

@Injectable()
export class TaskUsersService {
  constructor(
    @InjectRepository(TaskUserEntity)
    private readonly taskUsersRepository: Repository<TaskUserEntity>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(payload: CreateTaskUserRequest) {
    const taskUser = await this.taskUsersRepository.save(
      this.taskUsersRepository.create(payload),
    );
    this.realtimeService.emitToUser(taskUser.user_id, 'notification.created', {
      type: 'task.assigned',
      task_id: taskUser.task_id,
      user_id: taskUser.user_id,
    });
    return successResponse(
      'Task User Created',
      'Task user created successfully',
      responseData(await this.findOne(taskUser.id)),
    );
  }

  findAll() {
    return this.taskUsersRepository
      .find({
        relations: { task: { user: true }, user: true },
        order: { id: 'DESC' },
      })
      .then((taskUsers) =>
        successResponse(
          'Task Users Retrieved',
          'Task users retrieved successfully',
          removePasswords(taskUsers),
        ),
      );
  }

  async findOne(id: number) {
    const taskUser = await this.taskUsersRepository.findOne({
      where: { id },
      relations: { task: { user: true }, user: true },
    });
    if (!taskUser) {
      throw new NotFoundException(
        errorResponse('Task User Not Found', `Task user ${id} was not found`),
      );
    }

    return successResponse(
      'Task User Retrieved',
      'Task user retrieved successfully',
      removePasswords(taskUser),
    );
  }

  async update(id: number, payload: UpdateTaskUserRequest) {
    const taskUser = await this.taskUsersRepository.preload({ id, ...payload });
    if (!taskUser) {
      throw new NotFoundException(
        errorResponse('Task User Not Found', `Task user ${id} was not found`),
      );
    }

    const savedTaskUser = await this.taskUsersRepository.save(taskUser);
    return successResponse(
      'Task User Updated',
      'Task user updated successfully',
      responseData(await this.findOne(savedTaskUser.id)),
    );
  }

  async remove(id: number) {
    const taskUser = responseData(await this.findOne(id));
    await this.taskUsersRepository.remove(taskUser);
    return successResponse(
      'Task User Deleted',
      'Task user deleted successfully',
    );
  }
}
