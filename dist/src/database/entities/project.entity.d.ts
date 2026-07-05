import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
export declare class ProjectEntity {
    id: number;
    user_id: number;
    label: string;
    description: string | null;
    photo: string | null;
    created_at: Date;
    updated_at: Date;
    user: UserEntity;
    tasks: TaskEntity[];
}
