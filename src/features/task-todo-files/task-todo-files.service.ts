import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { TaskTodoFileEntity } from '../../database/entities';
import { CreateTaskTodoFileRequest, UpdateTaskTodoFileRequest } from './dto';

@Injectable()
export class TaskTodoFilesService {
  constructor(
    @InjectRepository(TaskTodoFileEntity)
    private readonly taskTodoFilesRepository: Repository<TaskTodoFileEntity>,
  ) {}

  async create(payload: CreateTaskTodoFileRequest) {
    const taskTodoFile = await this.taskTodoFilesRepository.save(
      this.taskTodoFilesRepository.create(payload),
    );
    return successResponse(
      'Task Todo File Created',
      'Task todo file created successfully',
      responseData(await this.findOne(taskTodoFile.id)),
    );
  }

  findAll() {
    return this.taskTodoFilesRepository
      .find({
        relations: { taskTodo: { task: { user: true }, user: true } },
        order: { id: 'DESC' },
      })
      .then((taskTodoFiles) =>
        successResponse(
          'Task Todo Files Retrieved',
          'Task todo files retrieved successfully',
          removePasswords(taskTodoFiles),
        ),
      );
  }

  async findOne(id: number) {
    const taskTodoFile = await this.taskTodoFilesRepository.findOne({
      where: { id },
      relations: { taskTodo: { task: { user: true }, user: true } },
    });
    if (!taskTodoFile) {
      throw new NotFoundException(
        errorResponse(
          'Task Todo File Not Found',
          `Task todo file ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Task Todo File Retrieved',
      'Task todo file retrieved successfully',
      removePasswords(taskTodoFile),
    );
  }

  async update(id: number, payload: UpdateTaskTodoFileRequest) {
    const taskTodoFile = await this.taskTodoFilesRepository.preload({
      id,
      ...payload,
    });
    if (!taskTodoFile) {
      throw new NotFoundException(
        errorResponse(
          'Task Todo File Not Found',
          `Task todo file ${id} was not found`,
        ),
      );
    }

    const savedTaskTodoFile =
      await this.taskTodoFilesRepository.save(taskTodoFile);
    return successResponse(
      'Task Todo File Updated',
      'Task todo file updated successfully',
      responseData(await this.findOne(savedTaskTodoFile.id)),
    );
  }

  async remove(id: number) {
    const taskTodoFile = responseData(await this.findOne(id));
    await this.taskTodoFilesRepository.remove(taskTodoFile);
    return successResponse(
      'Task Todo File Deleted',
      'Task todo file deleted successfully',
    );
  }
}
