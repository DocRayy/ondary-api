import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginRequest } from './dto/login.request';
import { AuthenticatedUser } from './types/authenticated-user.type';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    login(payload: LoginRequest): Promise<{
        title: string;
        message: string;
        data: {
            access_token: string;
            token_type: string;
            expires_in: string;
            user: AuthenticatedUser;
        } | undefined;
    }>;
    logout(user: AuthenticatedUser): {
        title: string;
        message: string;
        data: {
            user_id: number;
            username: string;
            user_role: string;
        } | undefined;
    };
}
