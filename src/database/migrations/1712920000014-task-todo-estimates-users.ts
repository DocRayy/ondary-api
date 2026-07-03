import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class TaskTodoEstimatesUsers1712920000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskTodosTable = await queryRunner.getTable('task_todos');
    if (
      taskTodosTable &&
      !taskTodosTable.columns.some((column) => column.name === 'estimate_time')
    ) {
      await queryRunner.addColumn(
        'task_todos',
        new TableColumn({
          name: 'estimate_time',
          type: 'int',
          unsigned: true,
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasTable('task_todo_users'))) {
      await queryRunner.createTable(
        new Table({
          name: 'task_todo_users',
          columns: [
            {
              name: 'id',
              type: 'int',
              unsigned: true,
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'task_todo_id',
              type: 'int',
              unsigned: true,
            },
            {
              name: 'user_id',
              type: 'int',
              unsigned: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );
    }

    await this.createIndexIfMissing(
      queryRunner,
      'task_todo_users',
      new TableIndex({
        name: 'IDX_TASK_TODO_USERS_TASK_TODO_ID',
        columnNames: ['task_todo_id'],
      }),
    );
    await this.createIndexIfMissing(
      queryRunner,
      'task_todo_users',
      new TableIndex({
        name: 'IDX_TASK_TODO_USERS_USER_ID',
        columnNames: ['user_id'],
      }),
    );
    await this.createIndexIfMissing(
      queryRunner,
      'task_todo_users',
      new TableIndex({
        name: 'UQ_TASK_TODO_USERS_TASK_TODO_USER',
        columnNames: ['task_todo_id', 'user_id'],
        isUnique: true,
      }),
    );

    await this.createForeignKeyIfMissing(
      queryRunner,
      'task_todo_users',
      'task_todo_id',
      new TableForeignKey({
        columnNames: ['task_todo_id'],
        referencedTableName: 'task_todos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await this.createForeignKeyIfMissing(
      queryRunner,
      'task_todo_users',
      'user_id',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task_todo_users', true);
  }

  private async createIndexIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    index: TableIndex,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (!table?.indices.some((tableIndex) => tableIndex.name === index.name)) {
      await queryRunner.createIndex(tableName, index);
    }
  }

  private async createForeignKeyIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
    foreignKey: TableForeignKey,
  ) {
    const table = await queryRunner.getTable(tableName);
    const exists = table?.foreignKeys.some((tableForeignKey) =>
      tableForeignKey.columnNames.includes(columnName),
    );

    if (!exists) {
      await queryRunner.createForeignKey(tableName, foreignKey);
    }
  }
}
