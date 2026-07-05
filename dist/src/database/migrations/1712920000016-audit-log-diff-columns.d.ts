import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AuditLogDiffColumns1712920000016 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
}
