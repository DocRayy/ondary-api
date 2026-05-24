import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { TaskBookmarkEntity } from '../../database/entities';
import { CreateTaskBookmarkRequest, UpdateTaskBookmarkRequest } from './dto';

@Injectable()
export class TaskBookmarksService {
  constructor(
    @InjectRepository(TaskBookmarkEntity)
    private readonly taskBookmarksRepository: Repository<TaskBookmarkEntity>,
  ) {}

  async create(payload: CreateTaskBookmarkRequest) {
    const taskBookmark = await this.taskBookmarksRepository.save(
      this.taskBookmarksRepository.create(payload),
    );
    return successResponse(
      'Task Bookmark Created',
      'Task bookmark created successfully',
      responseData(await this.findOne(taskBookmark.id)),
    );
  }

  findAll() {
    return this.taskBookmarksRepository
      .find({
        relations: { task: { user: true }, user: true },
        order: { id: 'DESC' },
      })
      .then((taskBookmarks) =>
        successResponse(
          'Task Bookmarks Retrieved',
          'Task bookmarks retrieved successfully',
          removePasswords(taskBookmarks),
        ),
      );
  }

  async findOne(id: number) {
    const taskBookmark = await this.taskBookmarksRepository.findOne({
      where: { id },
      relations: { task: { user: true }, user: true },
    });
    if (!taskBookmark) {
      throw new NotFoundException(
        errorResponse(
          'Task Bookmark Not Found',
          `Task bookmark ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Task Bookmark Retrieved',
      'Task bookmark retrieved successfully',
      removePasswords(taskBookmark),
    );
  }

  async update(id: number, payload: UpdateTaskBookmarkRequest) {
    const taskBookmark = await this.taskBookmarksRepository.preload({
      id,
      ...payload,
    });
    if (!taskBookmark) {
      throw new NotFoundException(
        errorResponse(
          'Task Bookmark Not Found',
          `Task bookmark ${id} was not found`,
        ),
      );
    }

    const savedTaskBookmark =
      await this.taskBookmarksRepository.save(taskBookmark);
    return successResponse(
      'Task Bookmark Updated',
      'Task bookmark updated successfully',
      responseData(await this.findOne(savedTaskBookmark.id)),
    );
  }

  async remove(id: number) {
    const taskBookmark = responseData(await this.findOne(id));
    await this.taskBookmarksRepository.remove(taskBookmark);
    return successResponse(
      'Task Bookmark Deleted',
      'Task bookmark deleted successfully',
    );
  }
}
