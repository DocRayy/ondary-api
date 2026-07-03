import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AuditLogDiffColumns1712920000016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addColumnIfMissing(
      queryRunner,
      new TableColumn({
        name: 'table_name',
        type: 'varchar',
        length: '80',
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      new TableColumn({ name: 'old_values', type: 'json', isNullable: true }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      new TableColumn({ name: 'new_values', type: 'json', isNullable: true }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      new TableColumn({
        name: 'changed_fields',
        type: 'json',
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      new TableColumn({
        name: 'database_changes',
        type: 'json',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('audit_logs');
    for (const columnName of [
      'database_changes',
      'changed_fields',
      'new_values',
      'old_values',
      'table_name',
    ]) {
      if (table?.columns.some((column) => column.name === columnName)) {
        await queryRunner.dropColumn('audit_logs', columnName);
      }
    }
  }

  private async addColumnIfMissing(
    queryRunner: QueryRunner,
    column: TableColumn,
  ) {
    const table = await queryRunner.getTable('audit_logs');
    if (
      !table?.columns.some((tableColumn) => tableColumn.name === column.name)
    ) {
      await queryRunner.addColumn('audit_logs', column);
    }
  }
}
