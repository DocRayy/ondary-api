"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullableTimelogTaskTodo1712920000002 = void 0;
const typeorm_1 = require("typeorm");
class NullableTimelogTaskTodo1712920000002 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('timelogs');
        const taskTodoForeignKey = table?.foreignKeys.find((foreignKey) => foreignKey.columnNames.includes('task_todo_id'));
        if (taskTodoForeignKey) {
            await queryRunner.dropForeignKey('timelogs', taskTodoForeignKey);
        }
        await queryRunner.changeColumn('timelogs', 'task_todo_id', new typeorm_1.TableColumn({
            name: 'task_todo_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await queryRunner.createForeignKey('timelogs', new typeorm_1.TableForeignKey({
            columnNames: ['task_todo_id'],
            referencedTableName: 'task_todos',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('timelogs');
        const taskTodoForeignKey = table?.foreignKeys.find((foreignKey) => foreignKey.columnNames.includes('task_todo_id'));
        if (taskTodoForeignKey) {
            await queryRunner.dropForeignKey('timelogs', taskTodoForeignKey);
        }
        await queryRunner.changeColumn('timelogs', 'task_todo_id', new typeorm_1.TableColumn({
            name: 'task_todo_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
        }));
        await queryRunner.createForeignKey('timelogs', new typeorm_1.TableForeignKey({
            columnNames: ['task_todo_id'],
            referencedTableName: 'task_todos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
}
exports.NullableTimelogTaskTodo1712920000002 = NullableTimelogTaskTodo1712920000002;
//# sourceMappingURL=1712920000002-nullable-timelog-task-todo.js.map