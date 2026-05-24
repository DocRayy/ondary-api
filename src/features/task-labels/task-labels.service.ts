import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { TaskLabelEntity } from '../../database/entities';
import { CreateTaskLabelRequest, UpdateTaskLabelRequest } from './dto';

@Injectable()
export class TaskLabelsService {
  constructor(
    @InjectRepository(TaskLabelEntity)
    private readonly taskLabelsRepository: Repository<TaskLabelEntity>,
  ) {}

  async create(payload: CreateTaskLabelRequest) {
    const taskLabel = await this.taskLabelsRepository.save(
      this.taskLabelsRepository.create(payload),
    );

    return successResponse(
      'Task Label Created',
      'Task label created successfully',
      taskLabel,
    );
  }

  findAll() {
    return this.taskLabelsRepository
      .find()
      .then((taskLabels) =>
        successResponse(
          'Task Labels Retrieved',
          'Task labels retrieved successfully',
          taskLabels,
        ),
      );
  }

  async findOne(id: number) {
    const taskLabel = await this.taskLabelsRepository.findOne({
      where: { id },
    });
    if (!taskLabel) {
      throw new NotFoundException(
        errorResponse('Task Label Not Found', `Task label ${id} was not found`),
      );
    }

    return successResponse(
      'Task Label Retrieved',
      'Task label retrieved successfully',
      taskLabel,
    );
  }

  async update(id: number, payload: UpdateTaskLabelRequest) {
    const taskLabel = await this.taskLabelsRepository.preload({
      id,
      ...payload,
    });
    if (!taskLabel) {
      throw new NotFoundException(
        errorResponse('Task Label Not Found', `Task label ${id} was not found`),
      );
    }

    return successResponse(
      'Task Label Updated',
      'Task label updated successfully',
      await this.taskLabelsRepository.save(taskLabel),
    );
  }

  async remove(id: number) {
    const taskLabel = responseData(await this.findOne(id));
    await this.taskLabelsRepository.remove(taskLabel);
    return successResponse(
      'Task Label Deleted',
      'Task label deleted successfully',
    );
  }
}
