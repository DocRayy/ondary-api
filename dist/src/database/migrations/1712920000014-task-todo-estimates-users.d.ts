import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TaskTodoEstimatesUsers1712920000014 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private createIndexIfMissing;
    private createForeignKeyIfMissing;
}
