import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { RealtimeService } from './realtime.service';
import { SocketUser } from './types/socket-user.type';

type AuthenticatedSocket = Socket & {
  data: {
    user?: SocketUser;
  };
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly realtimeService: RealtimeService,
  ) {}

  afterInit(server: Server) {
    this.realtimeService.setServer(server);
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        username: string;
      }>(token);
      const user = await this.usersService.findByIdForAuth(payload.sub);

      if (!user || user.status !== 'active') {
        client.disconnect(true);
        return;
      }

      client.data.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      await client.join(this.realtimeService.userRoom(user.id));

      this.realtimeService.emitPresence('user.online', {
        user_id: user.id,
        username: user.username,
      });
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = client.data.user;

    if (user) {
      this.realtimeService.emitPresence('user.offline', {
        user_id: user.id,
        username: user.username,
      });
    }
  }

  @SubscribeMessage('project.join')
  async joinProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { project_id: number },
  ) {
    if (!client.data.user || !payload?.project_id) {
      return { ok: false };
    }

    await client.join(
      this.realtimeService.projectRoom(Number(payload.project_id)),
    );
    return {
      ok: true,
      room: this.realtimeService.projectRoom(payload.project_id),
    };
  }

  @SubscribeMessage('workspace.join')
  async joinWorkspace(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { workspace_id: number },
  ) {
    if (!client.data.user || !payload?.workspace_id) {
      return { ok: false };
    }

    await client.join(
      this.realtimeService.workspaceRoom(Number(payload.workspace_id)),
    );
    return {
      ok: true,
      room: this.realtimeService.workspaceRoom(payload.workspace_id),
    };
  }

  @SubscribeMessage('team.join')
  async joinTeam(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { team_id: number },
  ) {
    if (!client.data.user || !payload?.team_id) {
      return { ok: false };
    }

    await client.join(this.realtimeService.teamRoom(Number(payload.team_id)));
    return { ok: true, room: this.realtimeService.teamRoom(payload.team_id) };
  }

  private extractToken(client: Socket): string {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken.replace(/^Bearer\s+/i, '');
    }

    const authorization = client.handshake.headers.authorization;
    if (authorization) {
      return authorization.replace(/^Bearer\s+/i, '');
    }

    throw new Error('Missing socket token');
  }
}
