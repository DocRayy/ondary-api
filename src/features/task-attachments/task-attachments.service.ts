import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { publicMediaUrl } from '../../common/uploads/media-url.util';
import {
  uploadedFilePath,
  uploadedFileUrl,
  UploadedFile,
} from '../../common/uploads/photo-upload.config';
import { TaskAttachmentEntity, TaskEntity } from '../../database/entities';
import {
  CreateTaskAttachmentRequest,
  UpdateTaskAttachmentRequest,
} from './dto';

type TaskAttachmentResponse = TaskAttachmentEntity & {
  file_url?: string | null;
  file_path_url?: string | null;
};

@Injectable()
export class TaskAttachmentsService {
  constructor(
    @InjectRepository(TaskAttachmentEntity)
    private readonly taskAttachmentsRepository: Repository<TaskAttachmentEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(payload: CreateTaskAttachmentRequest, files: UploadedFile[]) {
    await this.findTask(payload.task_id);

    if (!files.length) {
      throw new BadRequestException(
        errorResponse('Attachment Required', 'At least one file is required'),
      );
    }

    const attachments = await this.taskAttachmentsRepository.save(
      files.map((file) =>
        this.taskAttachmentsRepository.create({
          task_id: payload.task_id,
          files: uploadedFileUrl('task-attachments', file) ?? '',
          file_path: uploadedFilePath('task-attachments', file) ?? null,
          original_name: file.originalname ?? null,
          mime_type: file.mimetype ?? null,
          size: file.size ?? null,
        }),
      ),
    );

    return successResponse(
      'Task Attachments Created',
      'Task attachments created successfully',
      this.withFileUrls(
        removePasswords(
          await this.taskAttachmentsRepository.find({
            where: attachments.map((attachment) => ({ id: attachment.id })),
            relations: { task: true },
            order: { id: 'DESC' },
          }),
        ),
      ),
    );
  }

  findAll(taskId?: number) {
    return this.taskAttachmentsRepository
      .find({
        where: taskId ? { task_id: taskId } : undefined,
        relations: { task: true },
        order: { id: 'DESC' },
      })
      .then((attachments) =>
        successResponse(
          'Task Attachments Retrieved',
          'Task attachments retrieved successfully',
          this.withFileUrls(removePasswords(attachments)),
        ),
      );
  }

  async findOne(id: number) {
    const attachment = await this.taskAttachmentsRepository.findOne({
      where: { id },
      relations: { task: true },
    });
    if (!attachment) {
      throw new NotFoundException(
        errorResponse(
          'Task Attachment Not Found',
          `Task attachment ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Task Attachment Retrieved',
      'Task attachment retrieved successfully',
      this.withFileUrls(removePasswords(attachment)),
    );
  }

  async update(id: number, payload: UpdateTaskAttachmentRequest) {
    if (payload.task_id) {
      await this.findTask(payload.task_id);
    }

    const attachment = await this.taskAttachmentsRepository.preload({
      id,
      ...payload,
    });
    if (!attachment) {
      throw new NotFoundException(
        errorResponse(
          'Task Attachment Not Found',
          `Task attachment ${id} was not found`,
        ),
      );
    }

    const savedAttachment =
      await this.taskAttachmentsRepository.save(attachment);
    return successResponse(
      'Task Attachment Updated',
      'Task attachment updated successfully',
      responseData(await this.findOne(savedAttachment.id)),
    );
  }

  async remove(id: number) {
    const attachment = responseData(await this.findOne(id));
    await this.taskAttachmentsRepository.remove(attachment);
    return successResponse(
      'Task Attachment Deleted',
      'Task attachment deleted successfully',
    );
  }

  private withFileUrls(
    attachments: TaskAttachmentEntity[],
  ): TaskAttachmentResponse[];
  private withFileUrls(
    attachment: TaskAttachmentEntity,
  ): TaskAttachmentResponse;
  private withFileUrls(
    attachmentOrAttachments: TaskAttachmentEntity | TaskAttachmentEntity[],
  ): TaskAttachmentResponse | TaskAttachmentResponse[] {
    if (Array.isArray(attachmentOrAttachments)) {
      return attachmentOrAttachments.map((attachment) =>
        this.withFileUrls(attachment),
      );
    }

    return {
      ...attachmentOrAttachments,
      file_url: publicMediaUrl(attachmentOrAttachments.files),
      file_path_url: publicMediaUrl(attachmentOrAttachments.file_path),
    };
  }

  private async findTask(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(
        errorResponse('Task Not Found', `Task ${taskId} was not found`),
      );
    }

    return task;
  }
}
