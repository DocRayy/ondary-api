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
  uploadedPhotoUrl,
  UploadedPhoto,
} from '../../common/uploads/photo-upload.config';
import { ProjectEntity } from '../../database/entities';
import { CreateProjectRequest, UpdateProjectRequest } from './dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
  ) {}

  async create(payload: CreateProjectRequest, photo?: UploadedPhoto) {
    const project = await this.projectsRepository.save(
      this.projectsRepository.create({
        ...payload,
        photo: uploadedPhotoUrl('projects', photo) ?? payload.photo,
      }),
    );
    return successResponse(
      'Project Created',
      'Project created successfully',
      responseData(await this.findOne(project.id)),
    );
  }

  findAll() {
    return this.projectsRepository
      .find({
        relations: {
          user: true,
          tasks: { user: true, createdBy: true, updatedBy: true },
        },
        order: { id: 'DESC' },
      })
      .then((projects) =>
        successResponse(
          'Projects Retrieved',
          'Projects retrieved successfully',
          this.withTaskIds(removePasswords(projects)),
        ),
      );
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        tasks: { user: true, createdBy: true, updatedBy: true },
      },
    });
    if (!project) {
      throw new NotFoundException(
        errorResponse('Project Not Found', `Project ${id} was not found`),
      );
    }

    return successResponse(
      'Project Retrieved',
      'Project retrieved successfully',
      this.withTaskIds(removePasswords(project)),
    );
  }

  async update(
    id: number,
    payload: UpdateProjectRequest,
    photo?: UploadedPhoto,
  ) {
    const project = await this.projectsRepository.preload({
      id,
      ...payload,
      ...(photo ? { photo: uploadedPhotoUrl('projects', photo) } : {}),
    });
    if (!project) {
      throw new NotFoundException(
        errorResponse('Project Not Found', `Project ${id} was not found`),
      );
    }

    const savedProject = await this.projectsRepository.save(project);
    return successResponse(
      'Project Updated',
      'Project updated successfully',
      responseData(await this.findOne(savedProject.id)),
    );
  }

  async remove(id: number) {
    const project = responseData(await this.findOne(id));
    await this.projectsRepository.remove(project);
    return successResponse('Project Deleted', 'Project deleted successfully');
  }

  private withTaskIds<T extends ProjectEntity | ProjectEntity[]>(
    project: T,
  ): T {
    if (Array.isArray(project)) {
      return project.map((item) => this.withTaskIds(item)) as T;
    }

    return {
      ...project,
      task_id: project.tasks?.map((task) => task.id) ?? [],
    } as T;
  }
}
