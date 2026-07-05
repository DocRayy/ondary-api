"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskProgress1712920000009 = void 0;
const typeorm_1 = require("typeorm");
class TaskProgress1712920000009 {
    async up(queryRunner) {
        await this.addColumnIfMissing(queryRunner, 'task', new typeorm_1.TableColumn({
            name: 'progress',
            type: 'int',
            unsigned: true,
            default: 0,
        }));
        await this.addIndexIfMissing(queryRunner, 'task', new typeorm_1.TableIndex({
            name: 'IDX_TASK_PROGRESS',
            columnNames: ['progress'],
        }));
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
    async down(queryRunner) {
        const table = await queryRunner.getTable('task');
        if (table?.findColumnByName('progress')) {
            await queryRunner.dropColumn('task', 'progress');
        }
    }
    async addColumnIfMissing(queryRunner, tableName, column) {
        const table = await queryRunner.getTable(tableName);
        if (!table || table.findColumnByName(column.name)) {
            return;
        }
        await queryRunner.addColumn(tableName, column);
    }
    async addIndexIfMissing(queryRunner, tableName, index) {
        const table = await queryRunner.getTable(tableName);
        if (!table || table.indices.some((item) => item.name === index.name)) {
            return;
        }
        await queryRunner.createIndex(tableName, index);
    }
}
exports.TaskProgress1712920000009 = TaskProgress1712920000009;
//# sourceMappingURL=1712920000009-task-progress.js.map