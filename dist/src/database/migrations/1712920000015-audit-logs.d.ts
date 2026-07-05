import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AuditLogs1712920000015 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private createIndexIfMissing;
}
