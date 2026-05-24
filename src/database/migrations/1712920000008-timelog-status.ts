import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class TimelogStatus1712920000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addColumnIfMissing(
      queryRunner,
      'timelogs',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '30',
        default: "'active'",
      }),
    );

    await queryRunner.query(`
      UPDATE timelogs
      SET status = CASE
        WHEN end IS NULL THEN 'active'
        ELSE 'pause'
      END
      WHERE status IS NULL OR status = ''
    `);

    await this.addIndexIfMissing(
      queryRunner,
      'timelogs',
      new TableIndex({
        name: 'IDX_TIMELOGS_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('timelogs');
    if (table?.findColumnByName('status')) {
      await queryRunner.dropColumn('timelogs', 'status');
    }
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

  private async addIndexIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    index: TableIndex,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (!table || table.indices.some((item) => item.name === index.name)) {
      return;
    }

    await queryRunner.createIndex(tableName, index);
  }
}
