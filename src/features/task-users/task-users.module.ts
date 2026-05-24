import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskUserEntity } from '../../database/entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { TaskUsersController } from './task-users.controller';
import { TaskUsersService } from './task-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskUserEntity]), RealtimeModule],
  controllers: [TaskUsersController],
  providers: [TaskUsersService],
  exports: [TaskUsersService],
})
export class TaskUsersModule {}
