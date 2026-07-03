import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { ManagerNoteEntity, UserEntity } from '../../database/entities';
import { NotificationService } from '../notification/public/notification.service';
import { CreateManagerNoteRequest, UpdateManagerNoteRequest } from './dto';

const MANAGER_NOTE_RECIPIENT_ROLES = ['member', 'admin'];

@Injectable()
export class ManagerNotesService {
  constructor(
    @InjectRepository(ManagerNoteEntity)
    private readonly managerNotesRepository: Repository<ManagerNoteEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(payload: CreateManagerNoteRequest) {
    if (payload.send_to_all) {
      return this.createForAllRecipients(payload);
    }

    const userId = payload.user_id;
    if (!userId) {
      throw new BadRequestException(
        errorResponse(
          'Manager Note Recipient Required',
          'user_id is required unless send_to_all is true',
        ),
      );
    }

    await this.validateRecipientUser(userId);

    const managerNote = await this.managerNotesRepository.save(
      this.managerNotesRepository.create({
        user_id: userId,
        title: payload.title,
        description: payload.description,
      }),
    );
    await this.notificationService.createForManagerNoteCreated(managerNote);

    return successResponse(
      'Manager Note Created',
      'Manager note created successfully',
      responseData(await this.findOne(managerNote.id)),
    );
  }

  private async createForAllRecipients(payload: CreateManagerNoteRequest) {
    const recipients = await this.usersRepository.find({
      where: { role: In(MANAGER_NOTE_RECIPIENT_ROLES) },
      select: { id: true },
    });

    if (recipients.length === 0) {
      throw new BadRequestException(
        errorResponse(
          'Manager Note Recipients Not Found',
          'No eligible manager note recipients were found',
        ),
      );
    }

    const managerNotes = await this.managerNotesRepository.save(
      recipients.map((recipient) =>
        this.managerNotesRepository.create({
          user_id: recipient.id,
          title: payload.title,
          description: payload.description,
        }),
      ),
    );

    await Promise.all(
      managerNotes.map((managerNote) =>
        this.notificationService.createForManagerNoteCreated(managerNote),
      ),
    );

    return successResponse(
      'Manager Notes Created',
      'Manager notes created successfully for all recipients',
      removePasswords(managerNotes),
    );
  }

  findRecipients() {
    return this.usersRepository
      .find({
        where: { role: In(MANAGER_NOTE_RECIPIENT_ROLES) },
        order: { id: 'DESC' },
      })
      .then((users) =>
        successResponse(
          'Manager Note Recipients Retrieved',
          'Manager note recipients retrieved successfully',
          removePasswords(users),
        ),
      );
  }

  findAll() {
    return this.managerNotesRepository
      .find({ relations: { user: true }, order: { id: 'DESC' } })
      .then((managerNotes) =>
        successResponse(
          'Manager Notes Retrieved',
          'Manager notes retrieved successfully',
          removePasswords(managerNotes),
        ),
      );
  }

  async findOne(id: number) {
    const managerNote = await this.managerNotesRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!managerNote) {
      throw new NotFoundException(
        errorResponse(
          'Manager Note Not Found',
          `Manager note ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Manager Note Retrieved',
      'Manager note retrieved successfully',
      removePasswords(managerNote),
    );
  }

  async update(id: number, payload: UpdateManagerNoteRequest) {
    if (payload.user_id) {
      await this.validateRecipientUser(payload.user_id);
    }

    const managerNote = await this.managerNotesRepository.preload({
      id,
      ...payload,
    });
    if (!managerNote) {
      throw new NotFoundException(
        errorResponse(
          'Manager Note Not Found',
          `Manager note ${id} was not found`,
        ),
      );
    }

    const savedManagerNote =
      await this.managerNotesRepository.save(managerNote);
    return successResponse(
      'Manager Note Updated',
      'Manager note updated successfully',
      responseData(await this.findOne(savedManagerNote.id)),
    );
  }

  async remove(id: number) {
    const managerNote = responseData(await this.findOne(id));
    await this.managerNotesRepository.softRemove(managerNote);
    return successResponse(
      'Manager Note Deleted',
      'Manager note deleted successfully',
    );
  }

  private async validateRecipientUser(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(
        errorResponse('User Not Found', `User ${userId} was not found`),
      );
    }

    if (!MANAGER_NOTE_RECIPIENT_ROLES.includes(user.role)) {
      throw new BadRequestException(
        errorResponse(
          'Invalid Manager Note Recipient',
          'Manager note can only be sent to users with member or admin roles',
        ),
      );
    }
  }
}
