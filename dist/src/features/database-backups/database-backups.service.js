"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseBackupsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseBackupsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const child_process_1 = require("child_process");
const api_response_util_1 = require("../../common/responses/api-response.util");
let DatabaseBackupsService = DatabaseBackupsService_1 = class DatabaseBackupsService {
    configService;
    logger = new common_1.Logger(DatabaseBackupsService_1.name);
    backupDir = (0, path_1.resolve)(process.cwd(), 'storage', 'backups');
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        void this.validateDatabaseCommand(this.resolveCommand(['MYSQLDUMP_PATH', 'DB_BACKUP_MYSQLDUMP_PATH'], 'mysqldump'), 'MYSQLDUMP_PATH').catch((error) => {
            this.logger.warn(`Database backup tool validation failed during boot: ${error.message}`);
        });
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        await this.ensureBackupDir();
        const filenames = await (0, promises_1.readdir)(this.backupDir);
        const files = await Promise.all(filenames
            .filter((filename) => filename.endsWith('.sql'))
            .map((filename) => this.toBackupFile(filename)));
        const filteredFiles = files
            .filter((file) => query.search
            ? file.filename.toLowerCase().includes(query.search.toLowerCase())
            : true)
            .sort((left, right) => right.created_at.getTime() - left.created_at.getTime());
        const total = filteredFiles.length;
        const items = filteredFiles.slice((page - 1) * limit, page * limit);
        return (0, api_response_util_1.successResponse)('Database Backups Retrieved', 'Database backups retrieved successfully', {
            items,
            meta: {
                total,
                page,
                limit,
                page_count: Math.ceil(total / limit),
                limit_options: [10, 25, 50, 100],
            },
        });
    }
    async create() {
        await this.ensureBackupDir();
        const filename = `ondary-backup-${this.timestamp()}.sql`;
        const filePath = this.resolveBackupPath(filename);
        try {
            await this.runDump(filePath);
        }
        catch (error) {
            await (0, promises_1.unlink)(filePath).catch(() => undefined);
            throw error;
        }
        return (0, api_response_util_1.successResponse)('Database Backup Created', 'Database backup created successfully', await this.toBackupFile(filename));
    }
    async restore(filename) {
        await this.ensureBackupDir();
        const backupFile = await this.resolveBackupFile(filename);
        const filePath = this.resolveBackupPath(backupFile);
        try {
            await (0, promises_1.stat)(filePath);
        }
        catch {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Backup Not Found', `Backup ${filename} was not found`));
        }
        await this.runRestore(filePath);
        return (0, api_response_util_1.successResponse)('Database Restored', 'Database restored successfully', await this.toBackupFile(backupFile));
    }
    async remove(filename) {
        await this.ensureBackupDir();
        const backupFile = await this.resolveBackupFile(filename);
        const filePath = this.resolveBackupPath(backupFile);
        try {
            await (0, promises_1.stat)(filePath);
        }
        catch {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Backup Not Found', `Backup ${filename} was not found`));
        }
        await (0, promises_1.unlink)(filePath);
        return (0, api_response_util_1.successResponse)('Database Backup Deleted', 'Database backup deleted successfully');
    }
    async getDownloadPath(filename) {
        await this.ensureBackupDir();
        const backupFile = await this.resolveBackupFile(filename);
        const filePath = this.resolveBackupPath(backupFile);
        try {
            await (0, promises_1.stat)(filePath);
        }
        catch {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Backup Not Found', `Backup ${filename} was not found`));
        }
        return { filePath, filename: backupFile };
    }
    async ensureBackupDir() {
        await (0, promises_1.mkdir)(this.backupDir, { recursive: true });
    }
    async toBackupFile(filename) {
        const file = await (0, promises_1.stat)(this.resolveBackupPath(filename));
        const id = this.createBackupId(filename);
        return {
            id,
            backup_id: id,
            backupId: id,
            _id: id,
            backup_name: filename,
            filename,
            timestamp: file.birthtime.toISOString(),
            size: file.size,
            status: 'ok',
            database_version: this.dbName(),
            created_at: file.birthtime,
            download_url: `/backups/${id}/download`,
        };
    }
    async resolveBackupFile(identifier) {
        if (/^[a-zA-Z0-9._-]+\.sql$/.test(identifier)) {
            return identifier;
        }
        if (!/^\d+$/.test(identifier)) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Invalid Backup File', 'Backup filename is invalid'));
        }
        const filenames = await (0, promises_1.readdir)(this.backupDir);
        const filename = filenames
            .filter((item) => item.endsWith('.sql'))
            .find((item) => String(this.createBackupId(item)) === identifier);
        if (!filename) {
            throw new common_1.NotFoundException((0, api_response_util_1.errorResponse)('Backup Not Found', `Backup ${identifier} was not found`));
        }
        return filename;
    }
    createBackupId(filename) {
        let hash = 0;
        for (const character of filename) {
            hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
        }
        return (hash % 2147483646) + 1;
    }
    resolveBackupPath(filename) {
        if (!/^[a-zA-Z0-9._-]+\.sql$/.test(filename)) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Invalid Backup File', 'Backup filename is invalid'));
        }
        const filePath = (0, path_1.resolve)((0, path_1.join)(this.backupDir, filename));
        if (!filePath.startsWith(this.backupDir)) {
            throw new common_1.BadRequestException((0, api_response_util_1.errorResponse)('Invalid Backup File', 'Backup filename is invalid'));
        }
        return filePath;
    }
    async runDump(filePath) {
        const command = await this.validateDatabaseCommand(this.resolveCommand(['MYSQLDUMP_PATH', 'DB_BACKUP_MYSQLDUMP_PATH'], 'mysqldump'), 'MYSQLDUMP_PATH');
        const output = (0, fs_1.createWriteStream)(filePath);
        await this.runDatabaseCommand(command, [
            '--host',
            this.dbHost(),
            '--port',
            String(this.dbPort()),
            '--user',
            this.dbUsername(),
            '--single-transaction',
            '--routines',
            '--triggers',
            this.dbName(),
        ], output);
    }
    async runRestore(filePath) {
        const command = await this.validateDatabaseCommand(this.resolveCommand(['MYSQL_PATH', 'DB_RESTORE_MYSQL_PATH'], 'mysql'), 'MYSQL_PATH');
        const input = (0, fs_1.createReadStream)(filePath);
        await this.runDatabaseCommand(command, [
            '--host',
            this.dbHost(),
            '--port',
            String(this.dbPort()),
            '--user',
            this.dbUsername(),
            this.dbName(),
        ], undefined, input);
    }
    runDatabaseCommand(command, args, output, input) {
        return new Promise((resolvePromise, rejectPromise) => {
            const process = (0, child_process_1.spawn)(command, args, {
                env: {
                    ...processEnv(),
                    MYSQL_PWD: this.dbPassword(),
                },
                windowsHide: true,
            });
            const stderr = [];
            process.stderr.on('data', (chunk) => stderr.push(chunk));
            if (output) {
                process.stdout.pipe(output);
            }
            if (input) {
                input.pipe(process.stdin);
            }
            process.on('error', (error) => {
                this.logger.error(`Database command failed to start. command="${command}" args="${this.redactArgs(args).join(' ')}" path="${processEnv().PATH ?? ''}" message="${error.message}"`, error.stack);
                rejectPromise(new common_1.InternalServerErrorException((0, api_response_util_1.errorResponse)('Database Backup Unavailable', this.databaseCommandUnavailableMessage(command))));
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolvePromise();
                    return;
                }
                const message = Buffer.concat(stderr).toString('utf8').trim() ||
                    `Database command exited with code ${code}`;
                this.logger.error(`Database command exited with code ${code}. command="${command}" args="${this.redactArgs(args).join(' ')}" message="${message}"`);
                rejectPromise(new common_1.InternalServerErrorException((0, api_response_util_1.errorResponse)('Database Backup Failed', 'Database backup could not be completed. Please contact the administrator to check the database backup configuration.')));
            });
        });
    }
    resolveCommand(envNames, fallback) {
        for (const envName of envNames) {
            const value = this.configService.get(envName);
            if (value?.trim()) {
                return {
                    command: value.trim(),
                    source: envName,
                };
            }
        }
        return {
            command: fallback,
            source: 'PATH',
        };
    }
    async validateDatabaseCommand(commandConfig, preferredEnvName) {
        const { command, source } = commandConfig;
        if (source !== 'PATH') {
            if (!(0, path_1.isAbsolute)(command)) {
                this.logger.error(`Database command path from ${source} is not absolute: "${command}"`);
                throw this.databaseCommandUnavailableException(command, preferredEnvName);
            }
            try {
                await (0, promises_1.access)(command);
                this.logger.log(`Database command resolved from ${source}: "${command}"`);
                return command;
            }
            catch (error) {
                this.logger.error(`Database command path from ${source} is not accessible: "${command}"`, error instanceof Error ? error.stack : undefined);
                throw this.databaseCommandUnavailableException(command, preferredEnvName);
            }
        }
        try {
            await this.assertCommandAvailable(command);
            this.logger.log(`Database command resolved from PATH: "${command}"`);
            return command;
        }
        catch (error) {
            this.logger.error(`Database command was not found in PATH. command="${command}" path="${processEnv().PATH ?? ''}"`, error instanceof Error ? error.stack : undefined);
            throw this.databaseCommandUnavailableException(command, preferredEnvName);
        }
    }
    databaseCommandUnavailableMessage(command) {
        return `Database backup tool is not available on this server. Please install MySQL client tools or configure MYSQLDUMP_PATH with the absolute path to ${command}.`;
    }
    databaseCommandUnavailableException(command, preferredEnvName) {
        return new common_1.InternalServerErrorException((0, api_response_util_1.errorResponse)('Database Backup Unavailable', `Database backup tool is not available on this server. Please install MySQL client tools or configure ${preferredEnvName} with the absolute path to ${command}.`));
    }
    assertCommandAvailable(command) {
        return new Promise((resolvePromise, rejectPromise) => {
            const child = (0, child_process_1.spawn)(command, ['--version'], {
                env: processEnv(),
                windowsHide: true,
            });
            child.on('error', rejectPromise);
            child.on('close', (code) => {
                if (code === 0) {
                    resolvePromise();
                    return;
                }
                rejectPromise(new Error(`Command exited with code ${code}`));
            });
        });
    }
    redactArgs(args) {
        return args.map((arg, index) => index > 0 && args[index - 1] === '--user' ? '[USER]' : arg);
    }
    timestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-');
    }
    dbHost() {
        return this.configService.get('DB_HOST') ?? '127.0.0.1';
    }
    dbPort() {
        return Number(this.configService.get('DB_PORT') ?? 3306);
    }
    dbUsername() {
        return this.configService.get('DB_USERNAME') ?? 'root';
    }
    dbPassword() {
        return this.configService.get('DB_PASSWORD') ?? '';
    }
    dbName() {
        return (this.configService.get('DB_DATABASE') ??
            this.configService.get('DB_NAME') ??
            'ondary');
    }
};
exports.DatabaseBackupsService = DatabaseBackupsService;
exports.DatabaseBackupsService = DatabaseBackupsService = DatabaseBackupsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseBackupsService);
function processEnv() {
    return process.env;
}
//# sourceMappingURL=database-backups.service.js.map