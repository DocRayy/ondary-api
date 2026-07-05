import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
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
export declare class TaskGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly usersService;
    private readonly realtimeService;
    server: Server;
    constructor(jwtService: JwtService, usersService: UsersService, realtimeService: RealtimeService);
    afterInit(server: Server): void;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    joinProject(client: AuthenticatedSocket, payload: {
        project_id: number;
    }): Promise<{
        ok: boolean;
        room?: undefined;
    } | {
        ok: boolean;
        room: string;
    }>;
    joinWorkspace(client: AuthenticatedSocket, payload: {
        workspace_id: number;
    }): Promise<{
        ok: boolean;
        room?: undefined;
    } | {
        ok: boolean;
        room: string;
    }>;
    joinTeam(client: AuthenticatedSocket, payload: {
        team_id: number;
    }): Promise<{
        ok: boolean;
        room?: undefined;
    } | {
        ok: boolean;
        room: string;
    }>;
    private extractToken;
}
export {};
