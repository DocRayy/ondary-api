import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ConsolidateTaskSchema1712920000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addJsonColumn(queryRunner, 'task', 'assignee_user_ids');
    await this.addJsonColumn(queryRunner, 'task', 'label_ids');
    await this.addJsonColumn(queryRunner, 'task', 'bookmarks');
    await this.addJsonColumn(queryRunner, 'task', 'files');
    await this.addJsonColumn(queryRunner, 'task', 'movement_history');
    await this.addJsonColumn(queryRunner, 'task_todos', 'files');

    await this.migrateTaskUsers(queryRunner);
    await this.migrateTaskLabels(queryRunner);
    await this.migrateTaskBookmarks(queryRunner);
    await this.migrateTaskFiles(queryRunner);
    await this.migrateTaskTodoFiles(queryRunner);
    await this.migrateMovementHistories(queryRunner);

    await this.dropTableIfExists(queryRunner, 'task_movement_histories');
    await this.dropTableIfExists(queryRunner, 'task_todo_files');
    await this.dropTableIfExists(queryRunner, 'task_files');
    await this.dropTableIfExists(queryRunner, 'task_bookmarks');
    await this.dropTableIfExists(queryRunner, 'task_label_maps');
    await this.dropTableIfExists(queryRunner, 'task_users');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropColumnIfExists(queryRunner, 'task_todos', 'files');
    await this.dropColumnIfExists(queryRunner, 'task', 'movement_history');
    await this.dropColumnIfExists(queryRunner, 'task', 'files');
    await this.dropColumnIfExists(queryRunner, 'task', 'bookmarks');
    await this.dropColumnIfExists(queryRunner, 'task', 'label_ids');
    await this.dropColumnIfExists(queryRunner, 'task', 'assignee_user_ids');
  }

  private async addJsonColumn(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (!table || table.findColumnByName(columnName)) {
      return;
    }

    await queryRunner.addColumn(
      tableName,
      new TableColumn({
        name: columnName,
        type: 'json',
        isNullable: true,
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

  private async dropTableIfExists(queryRunner: QueryRunner, tableName: string) {
    if (await queryRunner.hasTable(tableName)) {
      await queryRunner.dropTable(tableName, true);
    }
  }

  private async migrateTaskUsers(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasTable('task_users'))) {
      return;
    }

    await queryRunner.query(`
      UPDATE task t
      SET assignee_user_ids = (
        SELECT JSON_ARRAYAGG(tu.user_id)
        FROM task_users tu
        WHERE tu.task_id = t.id
      )
      WHERE EXISTS (
        SELECT 1 FROM task_users tu WHERE tu.task_id = t.id
      )
    `);
  }

  private async migrateTaskLabels(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasTable('task_label_maps'))) {
      return;
    }

    await queryRunner.query(`
      UPDATE task t
      SET label_ids = (
        SELECT JSON_ARRAYAGG(tlm.task_label_id)
        FROM task_label_maps tlm
        WHERE tlm.task_id = t.id
      )
      WHERE EXISTS (
        SELECT 1 FROM task_label_maps tlm WHERE tlm.task_id = t.id
      )
    `);
  }

  private async migrateTaskBookmarks(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasTable('task_bookmarks'))) {
      return;
    }

    await queryRunner.query(`
      UPDATE task t
      SET bookmarks = (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'user_id', tb.user_id,
            'label', tb.label,
            'created_at', tb.created_at,
            'updated_at', tb.updated_at
          )
        )
        FROM task_bookmarks tb
        WHERE tb.task_id = t.id
      )
      WHERE EXISTS (
        SELECT 1 FROM task_bookmarks tb WHERE tb.task_id = t.id
      )
    `);
  }

  private async migrateTaskFiles(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasTable('task_files'))) {
      return;
    }

    await queryRunner.query(`
      UPDATE task t
      SET files = (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'url', tf.url,
            'file_path', tf.file_path,
            'note', tf.note
          )
        )
        FROM task_files tf
        WHERE tf.task_id = t.id
      )
      WHERE EXISTS (
        SELECT 1 FROM task_files tf WHERE tf.task_id = t.id
      )
    `);
  }

  private async migrateTaskTodoFiles(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasTable('task_todo_files'))) {
      return;
    }

    await queryRunner.query(`
      UPDATE task_todos tt
      SET files = (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'url', ttf.url,
            'file_path', ttf.file_path,
            'note', ttf.note
          )
        )
        FROM task_todo_files ttf
        WHERE ttf.task_todo_id = tt.id
      )
      WHERE EXISTS (
        SELECT 1 FROM task_todo_files ttf WHERE ttf.task_todo_id = tt.id
      )
    `);
  }

  private async migrateMovementHistories(queryRunner: QueryRunner) {
    if (!(await queryRunner.hasTable('task_movement_histories'))) {
      return;
    }

    await queryRunner.query(`
      UPDATE task t
      SET movement_history = (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'from_status', tmh.from_status,
            'to_status', tmh.to_status,
            'from_order_index', tmh.from_order_index,
            'to_order_index', tmh.to_order_index,
            'moved_by', tmh.moved_by,
            'moved_at', tmh.moved_at
          )
        )
        FROM task_movement_histories tmh
        WHERE tmh.task_id = t.id
      )
      WHERE EXISTS (
        SELECT 1 FROM task_movement_histories tmh WHERE tmh.task_id = t.id
      )
    `);
  }
}
