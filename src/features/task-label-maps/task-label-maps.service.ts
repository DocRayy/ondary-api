import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { TaskLabelMapEntity } from '../../database/entities';
import {
  CreateTaskLabelMapRequest,
  TaskLabelMapParams,
  UpdateTaskLabelMapRequest,
} from './dto';

@Injectable()
export class TaskLabelMapsService {
  constructor(
    @InjectRepository(TaskLabelMapEntity)
    private readonly taskLabelMapsRepository: Repository<TaskLabelMapEntity>,
  ) {}

  async create(payload: CreateTaskLabelMapRequest) {
    const taskLabelMap = await this.taskLabelMapsRepository.save(
      this.taskLabelMapsRepository.create(payload),
    );
    return successResponse(
      'Task Label Map Created',
      'Task label map created successfully',
      responseData(await this.findOne(taskLabelMap)),
    );
  }

  findAll() {
    return this.taskLabelMapsRepository
      .find({
        relations: { task: { user: true }, taskLabel: true },
        order: { created_at: 'DESC' },
      })
      .then((taskLabelMaps) =>
        successResponse(
          'Task Label Maps Retrieved',
          'Task label maps retrieved successfully',
          removePasswords(taskLabelMaps),
        ),
      );
  }

  async findOne(params: TaskLabelMapParams) {
    const taskLabelMap = await this.taskLabelMapsRepository.findOne({
      where: {
        task_id: params.task_id,
        task_label_id: params.task_label_id,
      },
      relations: { task: { user: true }, taskLabel: true },
    });

    if (!taskLabelMap) {
      throw new NotFoundException(
        errorResponse(
          'Task Label Map Not Found',
          'Task label map was not found',
        ),
      );
    }

    return successResponse(
      'Task Label Map Retrieved',
      'Task label map retrieved successfully',
      removePasswords(taskLabelMap),
    );
  }

  async update(params: TaskLabelMapParams, payload: UpdateTaskLabelMapRequest) {
    await this.findOne(params);
    const savedTaskLabelMap = await this.taskLabelMapsRepository.save({
      ...params,
      ...payload,
    });
    return successResponse(
      'Task Label Map Updated',
      'Task label map updated successfully',
      responseData(await this.findOne(savedTaskLabelMap)),
    );
  }

  async remove(params: TaskLabelMapParams) {
    const taskLabelMap = responseData(await this.findOne(params));
    await this.taskLabelMapsRepository.remove(taskLabelMap);
    return successResponse(
      'Task Label Map Deleted',
      'Task label map deleted successfully',
    );
  }
}
