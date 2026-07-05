import { LoginRequest } from './dto/login.request';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './types/authenticated-user.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    me(user: AuthenticatedUser): AuthenticatedUser;
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
