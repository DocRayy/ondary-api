import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RealtimeService } from './realtime.service';
import { TaskGateway } from './task.gateway';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [RealtimeService, TaskGateway],
  exports: [RealtimeService],
})
export class RealtimeModule {}
