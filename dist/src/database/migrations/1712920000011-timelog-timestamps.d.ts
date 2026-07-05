import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TimelogTimestamps1712920000011 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
    private dropColumnIfExists;
}
