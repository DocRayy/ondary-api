import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TimelogStatus1712920000008 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private addColumnIfMissing;
    private addIndexIfMissing;
}
