import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TaskAuditColumns1712920000006 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
    private dropColumnIfExists;
    private addForeignKeyIfMissing;
}
