import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { TaskFileEntity } from '../../database/entities';
import { CreateTaskFileRequest, UpdateTaskFileRequest } from './dto';

@Injectable()
export class TaskFilesService {
  constructor(
    @InjectRepository(TaskFileEntity)
    private readonly taskFilesRepository: Repository<TaskFileEntity>,
  ) {}

  async create(payload: CreateTaskFileRequest) {
    const taskFile = await this.taskFilesRepository.save(
      this.taskFilesRepository.create(payload),
    );
    return successResponse(
      'Task File Created',
      'Task file created successfully',
      responseData(await this.findOne(taskFile.id)),
    );
  }

  findAll() {
    return this.taskFilesRepository
      .find({ relations: { task: { user: true } }, order: { id: 'DESC' } })
      .then((taskFiles) =>
        successResponse(
          'Task Files Retrieved',
          'Task files retrieved successfully',
          removePasswords(taskFiles),
        ),
      );
  }

  async findOne(id: number) {
    const taskFile = await this.taskFilesRepository.findOne({
      where: { id },
      relations: { task: { user: true } },
    });
    if (!taskFile) {
      throw new NotFoundException(
        errorResponse('Task File Not Found', `Task file ${id} was not found`),
      );
    }

    return successResponse(
      'Task File Retrieved',
      'Task file retrieved successfully',
      removePasswords(taskFile),
    );
  }

  async update(id: number, payload: UpdateTaskFileRequest) {
    const taskFile = await this.taskFilesRepository.preload({ id, ...payload });
    if (!taskFile) {
      throw new NotFoundException(
        errorResponse('Task File Not Found', `Task file ${id} was not found`),
      );
    }

    const savedTaskFile = await this.taskFilesRepository.save(taskFile);
    return successResponse(
      'Task File Updated',
      'Task file updated successfully',
      responseData(await this.findOne(savedTaskFile.id)),
    );
  }

  async remove(id: number) {
    const taskFile = responseData(await this.findOne(id));
    await this.taskFilesRepository.remove(taskFile);
    return successResponse(
      'Task File Deleted',
      'Task file deleted successfully',
    );
  }
}
