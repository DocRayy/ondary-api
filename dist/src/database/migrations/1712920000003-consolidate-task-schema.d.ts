import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class ConsolidateTaskSchema1712920000003 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addJsonColumn;
    private dropColumnIfExists;
    private dropTableIfExists;
    private migrateTaskUsers;
    private migrateTaskLabels;
    private migrateTaskBookmarks;
    private migrateTaskFiles;
    private migrateTaskTodoFiles;
    private migrateMovementHistories;
}
