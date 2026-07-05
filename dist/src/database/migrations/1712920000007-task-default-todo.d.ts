import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TaskDefaultTodo1712920000007 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
    private addIndexIfMissing;
    private addForeignKeyIfMissing;
    private dropColumnIfExists;
}
