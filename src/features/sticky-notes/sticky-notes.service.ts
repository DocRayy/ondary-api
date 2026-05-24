import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  errorResponse,
  responseData,
  successResponse,
} from '../../common/responses/api-response.util';
import { removePasswords } from '../../common/serialization/remove-passwords.util';
import { StickyNoteEntity } from '../../database/entities';
import { CreateStickyNoteRequest, UpdateStickyNoteRequest } from './dto';

@Injectable()
export class StickyNotesService {
  constructor(
    @InjectRepository(StickyNoteEntity)
    private readonly stickyNotesRepository: Repository<StickyNoteEntity>,
  ) {}

  async create(payload: CreateStickyNoteRequest) {
    const stickyNote = await this.stickyNotesRepository.save(
      this.stickyNotesRepository.create(payload),
    );
    return successResponse(
      'Sticky Note Created',
      'Sticky note created successfully',
      responseData(await this.findOne(stickyNote.id)),
    );
  }

  findAll() {
    return this.stickyNotesRepository
      .find({ relations: { user: true }, order: { id: 'DESC' } })
      .then((stickyNotes) =>
        successResponse(
          'Sticky Notes Retrieved',
          'Sticky notes retrieved successfully',
          removePasswords(stickyNotes),
        ),
      );
  }

  async findOne(id: number) {
    const stickyNote = await this.stickyNotesRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!stickyNote) {
      throw new NotFoundException(
        errorResponse(
          'Sticky Note Not Found',
          `Sticky note ${id} was not found`,
        ),
      );
    }

    return successResponse(
      'Sticky Note Retrieved',
      'Sticky note retrieved successfully',
      removePasswords(stickyNote),
    );
  }

  async update(id: number, payload: UpdateStickyNoteRequest) {
    const stickyNote = await this.stickyNotesRepository.preload({
      id,
      ...payload,
    });
    if (!stickyNote) {
      throw new NotFoundException(
        errorResponse(
          'Sticky Note Not Found',
          `Sticky note ${id} was not found`,
        ),
      );
    }

    const savedStickyNote = await this.stickyNotesRepository.save(stickyNote);
    return successResponse(
      'Sticky Note Updated',
      'Sticky note updated successfully',
      responseData(await this.findOne(savedStickyNote.id)),
    );
  }

  async remove(id: number) {
    const stickyNote = responseData(await this.findOne(id));
    await this.stickyNotesRepository.remove(stickyNote);
    return successResponse(
      'Sticky Note Deleted',
      'Sticky note deleted successfully',
    );
  }
}
