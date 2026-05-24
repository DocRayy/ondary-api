import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.type';
import { CreateNotificationRequest } from '../dto/create-notification.dto';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() payload: CreateNotificationRequest) {
    return this.notificationService.create(payload);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.findAll(user);
  }

  @Get('me')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.findMine(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.findOne(Number(id), user);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationService.markAsRead(Number(id), user);
  }
}
