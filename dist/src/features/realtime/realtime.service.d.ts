import { Server } from 'socket.io';
export declare class RealtimeService {
    private server?;
    setServer(server: Server): void;
    emitToProject(projectId: number, event: string, payload: unknown): void;
    emitToUser(userId: number, event: string, payload: unknown): void;
    emitPresence(event: string, payload: unknown): void;
    emitAuditLog(payload: unknown): void;
    projectRoom(projectId: number): string;
    workspaceRoom(workspaceId: number): string;
    teamRoom(teamId: number): string;
    userRoom(userId: number): string;
}
