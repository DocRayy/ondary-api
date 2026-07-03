import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import { access, mkdir, readdir, stat, unlink } from 'fs/promises';
import { isAbsolute, join, resolve } from 'path';
import { spawn } from 'child_process';
import {
  errorResponse,
  successResponse,
} from '../../common/responses/api-response.util';
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

@Injectable()
export class DatabaseBackupsService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseBackupsService.name);
  private readonly backupDir = resolve(process.cwd(), 'storage', 'backups');

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    void this.validateDatabaseCommand(
      this.resolveCommand(['MYSQLDUMP_PATH', 'DB_BACKUP_MYSQLDUMP_PATH'], 'mysqldump'),
      'MYSQLDUMP_PATH',
    ).catch((error: Error) => {
      this.logger.warn(
        `Database backup tool validation failed during boot: ${error.message}`,
      );
    });
  }

  async findAll(query: FindDatabaseBackupsQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    await this.ensureBackupDir();
    const filenames = await readdir(this.backupDir);
    const files = await Promise.all(
      filenames
        .filter((filename) => filename.endsWith('.sql'))
        .map((filename) => this.toBackupFile(filename)),
    );

    const filteredFiles = files
      .filter((file) =>
        query.search
          ? file.filename.toLowerCase().includes(query.search.toLowerCase())
          : true,
      )
      .sort(
        (left, right) => right.created_at.getTime() - left.created_at.getTime(),
      );
    const total = filteredFiles.length;
    const items = filteredFiles.slice((page - 1) * limit, page * limit);

    return successResponse(
      'Database Backups Retrieved',
      'Database backups retrieved successfully',
      {
        items,
        meta: {
          total,
          page,
          limit,
          page_count: Math.ceil(total / limit),
          limit_options: [10, 25, 50, 100],
        },
      },
    );
  }

  async create() {
    await this.ensureBackupDir();
    const filename = `ondary-backup-${this.timestamp()}.sql`;
    const filePath = this.resolveBackupPath(filename);

    try {
      await this.runDump(filePath);
    } catch (error) {
      await unlink(filePath).catch(() => undefined);
      throw error;
    }

    return successResponse(
      'Database Backup Created',
      'Database backup created successfully',
      await this.toBackupFile(filename),
    );
  }

  async restore(filename: string) {
    await this.ensureBackupDir();
    const backupFile = await this.resolveBackupFile(filename);
    const filePath = this.resolveBackupPath(backupFile);

    try {
      await stat(filePath);
    } catch {
      throw new NotFoundException(
        errorResponse('Backup Not Found', `Backup ${filename} was not found`),
      );
    }

    await this.runRestore(filePath);

    return successResponse(
      'Database Restored',
      'Database restored successfully',
      await this.toBackupFile(backupFile),
    );
  }

  async remove(filename: string) {
    await this.ensureBackupDir();
    const backupFile = await this.resolveBackupFile(filename);
    const filePath = this.resolveBackupPath(backupFile);

    try {
      await stat(filePath);
    } catch {
      throw new NotFoundException(
        errorResponse('Backup Not Found', `Backup ${filename} was not found`),
      );
    }

    await unlink(filePath);

    return successResponse(
      'Database Backup Deleted',
      'Database backup deleted successfully',
    );
  }

  async getDownloadPath(filename: string) {
    await this.ensureBackupDir();
    const backupFile = await this.resolveBackupFile(filename);
    const filePath = this.resolveBackupPath(backupFile);

    try {
      await stat(filePath);
    } catch {
      throw new NotFoundException(
        errorResponse('Backup Not Found', `Backup ${filename} was not found`),
      );
    }

    return { filePath, filename: backupFile };
  }

  private async ensureBackupDir() {
    await mkdir(this.backupDir, { recursive: true });
  }

  private async toBackupFile(filename: string): Promise<BackupFile> {
    const file = await stat(this.resolveBackupPath(filename));
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

  private async resolveBackupFile(identifier: string) {
    if (/^[a-zA-Z0-9._-]+\.sql$/.test(identifier)) {
      return identifier;
    }

    if (!/^\d+$/.test(identifier)) {
      throw new BadRequestException(
        errorResponse('Invalid Backup File', 'Backup filename is invalid'),
      );
    }

    const filenames = await readdir(this.backupDir);
    const filename = filenames
      .filter((item) => item.endsWith('.sql'))
      .find((item) => String(this.createBackupId(item)) === identifier);

    if (!filename) {
      throw new NotFoundException(
        errorResponse('Backup Not Found', `Backup ${identifier} was not found`),
      );
    }

    return filename;
  }

  private createBackupId(filename: string) {
    let hash = 0;

    for (const character of filename) {
      hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    }

    return (hash % 2147483646) + 1;
  }

  private resolveBackupPath(filename: string) {
    if (!/^[a-zA-Z0-9._-]+\.sql$/.test(filename)) {
      throw new BadRequestException(
        errorResponse('Invalid Backup File', 'Backup filename is invalid'),
      );
    }

    const filePath = resolve(join(this.backupDir, filename));
    if (!filePath.startsWith(this.backupDir)) {
      throw new BadRequestException(
        errorResponse('Invalid Backup File', 'Backup filename is invalid'),
      );
    }

    return filePath;
  }

  private async runDump(filePath: string) {
    const command = await this.validateDatabaseCommand(
      this.resolveCommand(['MYSQLDUMP_PATH', 'DB_BACKUP_MYSQLDUMP_PATH'], 'mysqldump'),
      'MYSQLDUMP_PATH',
    );
    const output = createWriteStream(filePath);

    await this.runDatabaseCommand(
      command,
      [
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
      ],
      output,
    );
  }

  private async runRestore(filePath: string) {
    const command = await this.validateDatabaseCommand(
      this.resolveCommand(['MYSQL_PATH', 'DB_RESTORE_MYSQL_PATH'], 'mysql'),
      'MYSQL_PATH',
    );
    const input = createReadStream(filePath);

    await this.runDatabaseCommand(
      command,
      [
        '--host',
        this.dbHost(),
        '--port',
        String(this.dbPort()),
        '--user',
        this.dbUsername(),
        this.dbName(),
      ],
      undefined,
      input,
    );
  }

  private runDatabaseCommand(
    command: string,
    args: string[],
    output?: NodeJS.WritableStream,
    input?: NodeJS.ReadableStream,
  ) {
    return new Promise<void>((resolvePromise, rejectPromise) => {
      const process = spawn(command, args, {
        env: {
          ...processEnv(),
          MYSQL_PWD: this.dbPassword(),
        },
        windowsHide: true,
      });
      const stderr: Buffer[] = [];

      process.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));

      if (output) {
        process.stdout.pipe(output);
      }
      if (input) {
        input.pipe(process.stdin);
      }

      process.on('error', (error) => {
        this.logger.error(
          `Database command failed to start. command="${command}" args="${this.redactArgs(args).join(' ')}" path="${processEnv().PATH ?? ''}" message="${error.message}"`,
          error.stack,
        );
        rejectPromise(
          new InternalServerErrorException(
            errorResponse(
              'Database Backup Unavailable',
              this.databaseCommandUnavailableMessage(command),
            ),
          ),
        );
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolvePromise();
          return;
        }

        const message =
          Buffer.concat(stderr).toString('utf8').trim() ||
          `Database command exited with code ${code}`;
        this.logger.error(
          `Database command exited with code ${code}. command="${command}" args="${this.redactArgs(args).join(' ')}" message="${message}"`,
        );
        rejectPromise(
          new InternalServerErrorException(
            errorResponse(
              'Database Backup Failed',
              'Database backup could not be completed. Please contact the administrator to check the database backup configuration.',
            ),
          ),
        );
      });
    });
  }

  private resolveCommand(envNames: string[], fallback: string) {
    for (const envName of envNames) {
      const value = this.configService.get<string>(envName);
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

  private async validateDatabaseCommand(
    commandConfig: { command: string; source: string },
    preferredEnvName: string,
  ) {
    const { command, source } = commandConfig;

    if (source !== 'PATH') {
      if (!isAbsolute(command)) {
        this.logger.error(
          `Database command path from ${source} is not absolute: "${command}"`,
        );
        throw this.databaseCommandUnavailableException(command, preferredEnvName);
      }

      try {
        await access(command);
        this.logger.log(
          `Database command resolved from ${source}: "${command}"`,
        );
        return command;
      } catch (error) {
        this.logger.error(
          `Database command path from ${source} is not accessible: "${command}"`,
          error instanceof Error ? error.stack : undefined,
        );
        throw this.databaseCommandUnavailableException(command, preferredEnvName);
      }
    }

    try {
      await this.assertCommandAvailable(command);
      this.logger.log(`Database command resolved from PATH: "${command}"`);
      return command;
    } catch (error) {
      this.logger.error(
        `Database command was not found in PATH. command="${command}" path="${processEnv().PATH ?? ''}"`,
        error instanceof Error ? error.stack : undefined,
      );
      throw this.databaseCommandUnavailableException(command, preferredEnvName);
    }
  }

  private databaseCommandUnavailableMessage(command: string) {
    return `Database backup tool is not available on this server. Please install MySQL client tools or configure MYSQLDUMP_PATH with the absolute path to ${command}.`;
  }

  private databaseCommandUnavailableException(
    command: string,
    preferredEnvName: string,
  ) {
    return new InternalServerErrorException(
      errorResponse(
        'Database Backup Unavailable',
        `Database backup tool is not available on this server. Please install MySQL client tools or configure ${preferredEnvName} with the absolute path to ${command}.`,
      ),
    );
  }

  private assertCommandAvailable(command: string) {
    return new Promise<void>((resolvePromise, rejectPromise) => {
      const child = spawn(command, ['--version'], {
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

  private redactArgs(args: string[]) {
    return args.map((arg, index) =>
      index > 0 && args[index - 1] === '--user' ? '[USER]' : arg,
    );
  }

  private timestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  private dbHost() {
    return this.configService.get<string>('DB_HOST') ?? '127.0.0.1';
  }

  private dbPort() {
    return Number(this.configService.get<string>('DB_PORT') ?? 3306);
  }

  private dbUsername() {
    return this.configService.get<string>('DB_USERNAME') ?? 'root';
  }

  private dbPassword() {
    return this.configService.get<string>('DB_PASSWORD') ?? '';
  }

  private dbName() {
    return (
      this.configService.get<string>('DB_DATABASE') ??
      this.configService.get<string>('DB_NAME') ??
      'ondary'
    );
  }
}

function processEnv() {
  return process.env;
}
