import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RealtimeService {
  private server?: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToProject(projectId: number, event: string, payload: unknown) {
    this.server?.to(this.projectRoom(projectId)).emit(event, payload);
  }

  emitToUser(userId: number, event: string, payload: unknown) {
    this.server?.to(this.userRoom(userId)).emit(event, payload);
  }

  emitPresence(event: string, payload: unknown) {
    this.server?.emit(event, payload);
  }

  projectRoom(projectId: number) {
    return `project:${projectId}`;
  }

  workspaceRoom(workspaceId: number) {
    return `workspace:${workspaceId}`;
  }

  teamRoom(teamId: number) {
    return `team:${teamId}`;
  }

  userRoom(userId: number) {
    return `user:${userId}`;
  }
}
