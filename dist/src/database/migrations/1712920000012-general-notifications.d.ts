import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class GeneralNotifications1712920000012 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
    private dropColumnIfExists;
    private createIndexIfMissing;
    private dropIndexIfExists;
    private dropForeignKeyIfExists;
}
