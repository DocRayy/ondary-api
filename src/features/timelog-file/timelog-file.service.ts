import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import {
  uploadedPhotoPath,
  uploadedPhotoUrl,
  UploadedPhoto,
} from '../../common/uploads/photo-upload.config';
import { TimelogFileEntity } from '../../database/entities';
import { CreateTimelogFileRequest, UpdateTimelogFileRequest } from './dto';

@Injectable()
export class TimelogFileService {
  constructor(
    @InjectRepository(TimelogFileEntity)
    private readonly timelogFileRepository: Repository<TimelogFileEntity>,
  ) {}

  async create(payload: CreateTimelogFileRequest, photo?: UploadedPhoto) {
    const photoUrl = uploadedPhotoUrl('timelog-file', photo);
    const photoPath = uploadedPhotoPath('timelog-file', photo);
    const timelogFile = await this.timelogFileRepository.save(
      this.timelogFileRepository.create({
        ...payload,
        photo: photoUrl ?? payload.photo,
        file_url: photoUrl ?? payload.file_url,
        file_path: photoPath ?? payload.file_path,
      }),
    );
    return successResponse(
      'Timelog File Created',
      'Timelog file created successfully',
      responseData(await this.findOne(timelogFile.id)),
    );
  }

  findAll() {
    return this.timelogFileRepository
      .find({
        relations: { timelog: { user: true, taskTodo: { task: true } } },
        order: { id: 'DESC' },
      })
      .then((timelogFiles) =>
        successResponse(
          'Timelog Files Retrieved',
          'Timelog files retrieved successfully',
          removePasswords(timelogFiles),
        ),
      );
  }

  async findOne(id: number) {
    const timelogFile = await this.timelogFileRepository.findOne({
      where: { id },
      relations: { timelog: { user: true, taskTodo: { task: true } } },
    });
    if (!timelogFile) {
      throw new NotFoundException(
        errorResponse(
          'Timelog File Not Found',
          `Timelog file ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Timelog File Retrieved',
      'Timelog file retrieved successfully',
      removePasswords(timelogFile),
    );
  }

  async update(
    id: number,
    payload: UpdateTimelogFileRequest,
    photo?: UploadedPhoto,
  ) {
    const photoUrl = uploadedPhotoUrl('timelog-file', photo);
    const photoPath = uploadedPhotoPath('timelog-file', photo);
    const timelogFile = await this.timelogFileRepository.preload({
      id,
      ...payload,
      ...(photoUrl ? { photo: photoUrl, file_url: photoUrl } : {}),
      ...(photoPath ? { file_path: photoPath } : {}),
    });
    if (!timelogFile) {
      throw new NotFoundException(
        errorResponse(
          'Timelog File Not Found',
          `Timelog file ${id} was not found`,
        ),
      );
    }

    const savedTimelogFile = await this.timelogFileRepository.save(timelogFile);
    return successResponse(
      'Timelog File Updated',
      'Timelog file updated successfully',
      responseData(await this.findOne(savedTimelogFile.id)),
    );
  }

  async remove(id: number) {
    const timelogFile = responseData(await this.findOne(id));
    await this.timelogFileRepository.remove(timelogFile);
    return successResponse(
      'Timelog File Deleted',
      'Timelog file deleted successfully',
    );
  }
}
