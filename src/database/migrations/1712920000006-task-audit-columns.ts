import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class TaskAuditColumns1712920000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addColumnIfMissing(
      queryRunner,
      'task',
      new TableColumn({
        name: 'created_by',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'task',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'task',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );

    await this.addColumnIfMissing(
      queryRunner,
      'task_todos',
      new TableColumn({
        name: 'created_by',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'task_todos',
      new TableColumn({
        name: 'updated_by',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'task_todos',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'task_todos',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );

    await this.addForeignKeyIfMissing(queryRunner, 'task', 'created_by');
    await this.addForeignKeyIfMissing(queryRunner, 'task_todos', 'created_by');
    await this.addForeignKeyIfMissing(queryRunner, 'task_todos', 'updated_by');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropColumnIfExists(queryRunner, 'task_todos', 'updated_at');
    await this.dropColumnIfExists(queryRunner, 'task_todos', 'created_at');
    await this.dropColumnIfExists(queryRunner, 'task_todos', 'updated_by');
    await this.dropColumnIfExists(queryRunner, 'task_todos', 'created_by');
    await this.dropColumnIfExists(queryRunner, 'task', 'updated_at');
    await this.dropColumnIfExists(queryRunner, 'task', 'created_at');
    await this.dropColumnIfExists(queryRunner, 'task', 'created_by');
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

  private async addForeignKeyIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (
      !table ||
      table.foreignKeys.some((foreignKey) =>
        foreignKey.columnNames.includes(columnName),
      )
    ) {
      return;
    }

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: [columnName],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }
}
