import { Repository } from 'typeorm';
import { UploadedPhoto } from '../../common/uploads/photo-upload.config';
import { UserEntity } from '../../database/entities';
import { CreateUserRequest, UpdateUserRequest } from './dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    create(payload: CreateUserRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: UserEntity | undefined;
    }>;
    findAll(): Promise<{
        title: string;
        message: string;
        data: UserEntity[] | undefined;
    }>;
    findOne(id: number): Promise<{
        title: string;
        message: string;
        data: UserEntity | undefined;
    }>;
    findByIdForAuth(id: number): Promise<UserEntity | null>;
    findByUsernameOrEmail(identifier: string): Promise<UserEntity | null>;
    update(id: number, payload: UpdateUserRequest, photo?: UploadedPhoto): Promise<{
        title: string;
        message: string;
        data: UserEntity | undefined;
    }>;
    updatePasswordHash(id: number, password: string): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
