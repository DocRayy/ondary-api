import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ManagerNotesSoftDelete1712920000017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('manager_notes');
    if (!table?.columns.some((column) => column.name === 'deleted_at')) {
      await queryRunner.addColumn(
        'manager_notes',
        new TableColumn({
          name: 'deleted_at',
          type: 'timestamp',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('manager_notes');
    if (table?.columns.some((column) => column.name === 'deleted_at')) {
      await queryRunner.dropColumn('manager_notes', 'deleted_at');
    }
  }
}
