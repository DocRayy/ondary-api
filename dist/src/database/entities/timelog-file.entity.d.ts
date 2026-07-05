import { TimelogEntity } from './timelog.entity';
export declare class TimelogFileEntity {
    id: number;
    timelog_id: number;
    file_url: string | null;
    file_path: string | null;
    photo: string | null;
    note: string | null;
    timelog: TimelogEntity;
}
