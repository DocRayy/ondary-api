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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const api_response_util_1 = require("../../common/responses/api-response.util");
const password_util_1 = require("../../common/security/password.util");
const media_url_util_1 = require("../../common/uploads/media-url.util");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(payload) {
        const user = await this.usersService.findByUsernameOrEmail(payload.identifier);
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException((0, api_response_util_1.errorResponse)('Login Failed', 'Username/email or password is incorrect'));
        }
        const isValidPassword = await (0, password_util_1.verifyPassword)(payload.password, user.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException((0, api_response_util_1.errorResponse)('Login Failed', 'Username/email or password is incorrect'));
        }
        if (!(0, password_util_1.isPasswordHashed)(user.password)) {
            await this.usersService.updatePasswordHash(user.id, await (0, password_util_1.hashPassword)(payload.password));
        }
        const authUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            photo: (0, media_url_util_1.publicMediaPath)(user.photo),
            photo_url: (0, media_url_util_1.publicMediaUrl)(user.photo),
        };
        return (0, api_response_util_1.successResponse)('Login Successful', 'Login successful', {
            access_token: await this.jwtService.signAsync({
                sub: user.id,
                username: user.username,
            }),
            token_type: 'Bearer',
            expires_in: this.configService.get('JWT_EXPIRES_IN') ?? '1d',
            user: authUser,
        });
    }
    logout(user) {
        return (0, api_response_util_1.successResponse)('Logout Successful', 'Logout successful', {
            user_id: user.id,
            username: user.username,
            user_role: user.role,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map