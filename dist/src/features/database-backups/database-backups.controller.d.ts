import type { Response } from 'express';
import { DatabaseBackupsService } from './database-backups.service';
import { FindDatabaseBackupsQuery, RestoreDatabaseBackupRequest } from './dto';
export declare class DatabaseBackupsController {
    private readonly databaseBackupsService;
    constructor(databaseBackupsService: DatabaseBackupsService);
    findAll(query: FindDatabaseBackupsQuery): Promise<{
        title: string;
        message: string;
        data: {
            items: {
                id: number;
                backup_id: number;
                backupId: number;
                _id: number;
                backup_name: string;
                filename: string;
                timestamp: string;
                size: number;
                status: "ok";
                database_version: string;
                created_at: Date;
                download_url: string;
            }[];
            meta: {
                total: number;
                page: number;
                limit: number;
                page_count: number;
                limit_options: number[];
            };
        } | undefined;
    }>;
    create(): Promise<{
        title: string;
        message: string;
        data: {
            id: number;
            backup_id: number;
            backupId: number;
            _id: number;
            backup_name: string;
            filename: string;
            timestamp: string;
            size: number;
            status: "ok";
            database_version: string;
            created_at: Date;
            download_url: string;
        } | undefined;
    }>;
    restore(payload: RestoreDatabaseBackupRequest): Promise<{
        title: string;
        message: string;
        data: {
            id: number;
            backup_id: number;
            backupId: number;
            _id: number;
            backup_name: string;
            filename: string;
            timestamp: string;
            size: number;
            status: "ok";
            database_version: string;
            created_at: Date;
            download_url: string;
        } | undefined;
    }>;
    restoreById(id: string): Promise<{
        title: string;
        message: string;
        data: {
            id: number;
            backup_id: number;
            backupId: number;
            _id: number;
            backup_name: string;
            filename: string;
            timestamp: string;
            size: number;
            status: "ok";
            database_version: string;
            created_at: Date;
            download_url: string;
        } | undefined;
    }>;
    download(filename: string, response: Response): Promise<void>;
    remove(id: string): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
}
