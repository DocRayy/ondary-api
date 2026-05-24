import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UploadPhotoAndProjectTimestamps1712920000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('projects', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    ]);

    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'photo',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    ]);

    await queryRunner.addColumn(
      'timelog_file',
      new TableColumn({
        name: 'photo',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('timelog_file', 'photo');
    await queryRunner.dropColumn('users', 'updated_at');
    await queryRunner.dropColumn('users', 'photo');
    await queryRunner.dropColumn('projects', 'updated_at');
    await queryRunner.dropColumn('projects', 'created_at');
  }
}
