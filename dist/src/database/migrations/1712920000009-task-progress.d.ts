import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TaskProgress1712920000009 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
    private addIndexIfMissing;
}
