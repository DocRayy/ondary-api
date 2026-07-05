import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindDatabaseBackupsQuery } from './dto';
type BackupFile = {
    id: number;
    backup_id: number;
    backupId: number;
    _id: number;
    backup_name: string;
    filename: string;
    timestamp: string;
    size: number;
    status: 'ok';
    database_version: string;
    created_at: Date;
    download_url: string;
};
export declare class DatabaseBackupsService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private readonly backupDir;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    findAll(query: FindDatabaseBackupsQuery): Promise<{
        title: string;
        message: string;
        data: {
            items: BackupFile[];
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
        data: BackupFile | undefined;
    }>;
    restore(filename: string): Promise<{
        title: string;
        message: string;
        data: BackupFile | undefined;
    }>;
    remove(filename: string): Promise<{
        title: string;
        message: string;
        data: unknown;
    }>;
    getDownloadPath(filename: string): Promise<{
        filePath: string;
        filename: string;
    }>;
    private ensureBackupDir;
    private toBackupFile;
    private resolveBackupFile;
    private createBackupId;
    private resolveBackupPath;
    private runDump;
    private runRestore;
    private runDatabaseCommand;
    private resolveCommand;
    private validateDatabaseCommand;
    private databaseCommandUnavailableMessage;
    private databaseCommandUnavailableException;
    private assertCommandAvailable;
    private redactArgs;
    private timestamp;
    private dbHost;
    private dbPort;
    private dbUsername;
    private dbPassword;
    private dbName;
}
export {};
