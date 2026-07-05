export declare class CreateUserRequest {
    username: string;
    email: string;
    password: string;
    name: string;
    phone_no?: string;
    is_verified?: boolean;
    role?: string;
    status?: string;
    photo?: string;
}
export declare class UpdateUserRequest {
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    phone_no?: string;
    is_verified?: boolean;
    role?: string;
    status?: string;
    photo?: string;
}
