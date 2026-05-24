import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class TaskDefaultTodo1712920000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addColumnIfMissing(
      queryRunner,
      'task',
      new TableColumn({
        name: 'task_todo_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );

    await this.addIndexIfMissing(
      queryRunner,
      'task',
      new TableIndex({
        name: 'IDX_TASK_TASK_TODO_ID',
        columnNames: ['task_todo_id'],
      }),
    );

    await this.addForeignKeyIfMissing(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropColumnIfExists(queryRunner, 'task', 'task_todo_id');
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

  private async addForeignKeyIfMissing(queryRunner: QueryRunner) {
    const table = await queryRunner.getTable('task');
    if (
      !table ||
      table.foreignKeys.some((foreignKey) =>
        foreignKey.columnNames.includes('task_todo_id'),
      )
    ) {
      return;
    }

    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['task_todo_id'],
        referencedTableName: 'task_todos',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
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
