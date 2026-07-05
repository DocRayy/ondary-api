import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
export declare function seedAdminUser(usersRepository: Repository<UserEntity>): Promise<UserEntity>;
