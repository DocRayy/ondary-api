"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDefaultTodo1712920000007 = void 0;
const typeorm_1 = require("typeorm");
class TaskDefaultTodo1712920000007 {
    async up(queryRunner) {
        await this.addColumnIfMissing(queryRunner, 'task', new typeorm_1.TableColumn({
            name: 'task_todo_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addIndexIfMissing(queryRunner, 'task', new typeorm_1.TableIndex({
            name: 'IDX_TASK_TASK_TODO_ID',
            columnNames: ['task_todo_id'],
        }));
        await this.addForeignKeyIfMissing(queryRunner);
    }
    async down(queryRunner) {
        await this.dropColumnIfExists(queryRunner, 'task', 'task_todo_id');
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
    async addForeignKeyIfMissing(queryRunner) {
        const table = await queryRunner.getTable('task');
        if (!table ||
            table.foreignKeys.some((foreignKey) => foreignKey.columnNames.includes('task_todo_id'))) {
            return;
        }
        await queryRunner.createForeignKey('task', new typeorm_1.TableForeignKey({
            columnNames: ['task_todo_id'],
            referencedTableName: 'task_todos',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }
    async dropColumnIfExists(queryRunner, tableName, columnName) {
        const table = await queryRunner.getTable(tableName);
        if (!table?.findColumnByName(columnName)) {
            return;
        }
        await queryRunner.dropColumn(tableName, columnName);
    }
}
exports.TaskDefaultTodo1712920000007 = TaskDefaultTodo1712920000007;
//# sourceMappingURL=1712920000007-task-default-todo.js.map