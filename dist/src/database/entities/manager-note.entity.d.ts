import { UserEntity } from './user.entity';
export declare class ManagerNoteEntity {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    deleted_at: Date | null;
    user: UserEntity;
}
