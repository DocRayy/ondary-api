import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class TaskAttachmentsComments1712920000013 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
    private createIndexIfMissing;
    private createForeignKeyIfMissing;
}
