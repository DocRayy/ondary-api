import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class TaskProgress1712920000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addColumnIfMissing(
      queryRunner,
      'task',
      new TableColumn({
        name: 'progress',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
    );

    await this.addIndexIfMissing(
      queryRunner,
      'task',
      new TableIndex({
        name: 'IDX_TASK_PROGRESS',
        columnNames: ['progress'],
      }),
    );

    await queryRunner.query(`
      UPDATE task_todos tt
      LEFT JOIN (
        SELECT tl.task_todo_id, tl.status
        FROM timelogs tl
        INNER JOIN (
          SELECT task_todo_id, MAX(id) AS id
          FROM timelogs
          WHERE task_todo_id IS NOT NULL
          GROUP BY task_todo_id
        ) latest ON latest.id = tl.id
      ) latest_log ON latest_log.task_todo_id = tt.id
      SET
        tt.status = CASE
          WHEN latest_log.status IS NULL THEN 'draft'
          WHEN latest_log.status = 'finish' THEN 'complete'
          WHEN latest_log.status = 'pause' THEN 'break'
          ELSE 'pending'
        END,
        tt.progress = CASE
          WHEN latest_log.status = 'finish' THEN 100
          WHEN latest_log.status = 'pause' THEN 50
          ELSE 0
        END
    `);

    await queryRunner.query(`
      UPDATE task t
      LEFT JOIN (
        SELECT task_id, ROUND(AVG(progress)) AS progress
        FROM task_todos
        GROUP BY task_id
      ) todo_progress ON todo_progress.task_id = t.id
      SET t.progress = COALESCE(todo_progress.progress, 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('task');
    if (table?.findColumnByName('progress')) {
      await queryRunner.dropColumn('task', 'progress');
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
