import type { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import { CreateUserRequest, UpdateUserRequest, UserIdParam } from './dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(payload: CreateUserRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").UserEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").UserEntity[] | undefined;
    }>;
    findOne(params: UserIdParam): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").UserEntity | undefined;
    }>;
    update(params: UserIdParam, payload: UpdateUserRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: import("../../database/entities").UserEntity | undefined;
    }>;
    remove(params: UserIdParam): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
