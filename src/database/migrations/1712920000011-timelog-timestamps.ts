import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class TimelogTimestamps1712920000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addColumnIfMissing(
      queryRunner,
      'timelogs',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'timelogs',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropColumnIfExists(queryRunner, 'timelogs', 'updated_at');
    await this.dropColumnIfExists(queryRunner, 'timelogs', 'created_at');
  }

  private async addColumnIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    column: TableColumn,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (!table || table.findColumnByName(column.name)) {
      return;
    }

    await queryRunner.addColumn(tableName, column);
  }

  private async dropColumnIfExists(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (!table?.findColumnByName(columnName)) {
      return;
    }

    await queryRunner.dropColumn(tableName, columnName);
  }
}
