"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
const users_service_1 = require("../users/users.service");
const realtime_service_1 = require("./realtime.service");
let TaskGateway = class TaskGateway {
    jwtService;
    usersService;
    realtimeService;
    server;
    constructor(jwtService, usersService, realtimeService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.realtimeService = realtimeService;
    }
    afterInit(server) {
        this.realtimeService.setServer(server);
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            const payload = await this.jwtService.verifyAsync(token);
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
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const user = client.data.user;
        if (user) {
            this.realtimeService.emitPresence('user.offline', {
                user_id: user.id,
                username: user.username,
            });
        }
    }
    async joinProject(client, payload) {
        if (!client.data.user || !payload?.project_id) {
            return { ok: false };
        }
        await client.join(this.realtimeService.projectRoom(Number(payload.project_id)));
        return {
            ok: true,
            room: this.realtimeService.projectRoom(payload.project_id),
        };
    }
    async joinWorkspace(client, payload) {
        if (!client.data.user || !payload?.workspace_id) {
            return { ok: false };
        }
        await client.join(this.realtimeService.workspaceRoom(Number(payload.workspace_id)));
        return {
            ok: true,
            room: this.realtimeService.workspaceRoom(payload.workspace_id),
        };
    }
    async joinTeam(client, payload) {
        if (!client.data.user || !payload?.team_id) {
            return { ok: false };
        }
        await client.join(this.realtimeService.teamRoom(Number(payload.team_id)));
        return { ok: true, room: this.realtimeService.teamRoom(payload.team_id) };
    }
    extractToken(client) {
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
};
exports.TaskGateway = TaskGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TaskGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('project.join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "joinProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('workspace.join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "joinWorkspace", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('team.join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskGateway.prototype, "joinTeam", null);
exports.TaskGateway = TaskGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        realtime_service_1.RealtimeService])
], TaskGateway);
//# sourceMappingURL=task.gateway.js.map