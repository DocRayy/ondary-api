import { UserEntity } from './user.entity';
export declare class StickyNoteEntity {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    user: UserEntity;
}
