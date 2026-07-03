import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { hashPassword } from '../../common/security/password.util';
import { withPhotoUrl } from '../../common/uploads/media-url.util';
import {
  uploadedPhotoUrl,
  UploadedPhoto,
} from '../../common/uploads/photo-upload.config';
import { UserEntity } from '../../database/entities';
import { CreateUserRequest, UpdateUserRequest } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(payload: CreateUserRequest, photo?: UploadedPhoto) {
    const user = await this.usersRepository.save(
      this.usersRepository.create({
        ...payload,
        photo: uploadedPhotoUrl('users', photo) ?? payload.photo,
        password: await hashPassword(payload.password),
      }),
    );

    return successResponse(
      'User Created',
      'User created successfully',
      withPhotoUrl(removePasswords(user)),
    );
  }

  findAll() {
    return this.usersRepository
      .find({
        relations: {
          projects: true,
          tasks: true,
          taskTodos: true,
          timelogs: true,
          stickyNotes: true,
        },
        order: { id: 'DESC' },
      })
      .then((users) =>
        successResponse(
          'Users Retrieved',
          'Users retrieved successfully',
          withPhotoUrl(removePasswords(users)),
        ),
      );
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        projects: true,
        tasks: true,
        taskTodos: true,
        timelogs: true,
        stickyNotes: true,
      },
    });
    if (!user) {
      throw new NotFoundException(
        errorResponse('User Not Found', `User ${id} was not found`),
      );
    }

    return successResponse(
      'User Retrieved',
      'User retrieved successfully',
      withPhotoUrl(removePasswords(user)),
    );
  }

  findByIdForAuth(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByUsernameOrEmail(identifier: string) {
    const where: FindOptionsWhere<UserEntity>[] = [
      { username: identifier },
      { email: identifier },
    ];

    return this.usersRepository.findOne({ where });
  }

  async update(id: number, payload: UpdateUserRequest, photo?: UploadedPhoto) {
    const user = await this.usersRepository.preload({
      id,
      ...payload,
      ...(photo ? { photo: uploadedPhotoUrl('users', photo) } : {}),
      ...(payload.password
        ? { password: await hashPassword(payload.password) }
        : {}),
    });
    if (!user) {
      throw new NotFoundException(
        errorResponse('User Not Found', `User ${id} was not found`),
      );
    }

    const savedUser = await this.usersRepository.save(user);
    return successResponse(
      'User Updated',
      'User updated successfully',
      responseData(await this.findOne(savedUser.id)),
    );
  }

  updatePasswordHash(id: number, password: string) {
    return this.usersRepository.update(id, { password });
  }

  async remove(id: number) {
    const user = responseData(await this.findOne(id));
    await this.usersRepository.remove(user);
    return successResponse('User Deleted', 'User deleted successfully');
  }
}
