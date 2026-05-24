import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class NullableTimelogTaskTodo1712920000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('timelogs');
    const taskTodoForeignKey = table?.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes('task_todo_id'),
    );

    if (taskTodoForeignKey) {
      await queryRunner.dropForeignKey('timelogs', taskTodoForeignKey);
    }

    await queryRunner.changeColumn(
      'timelogs',
      'task_todo_id',
      new TableColumn({
        name: 'task_todo_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'timelogs',
      new TableForeignKey({
        columnNames: ['task_todo_id'],
        referencedTableName: 'task_todos',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('timelogs');
    const taskTodoForeignKey = table?.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes('task_todo_id'),
    );

    if (taskTodoForeignKey) {
      await queryRunner.dropForeignKey('timelogs', taskTodoForeignKey);
    }

    await queryRunner.changeColumn(
      'timelogs',
      'task_todo_id',
      new TableColumn({
        name: 'task_todo_id',
        type: 'int',
        unsigned: true,
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'timelogs',
      new TableForeignKey({
        columnNames: ['task_todo_id'],
        referencedTableName: 'task_todos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }
}
