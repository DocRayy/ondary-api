"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTodoEstimatesUsers1712920000014 = void 0;
const typeorm_1 = require("typeorm");
class TaskTodoEstimatesUsers1712920000014 {
    async up(queryRunner) {
        const taskTodosTable = await queryRunner.getTable('task_todos');
        if (taskTodosTable &&
            !taskTodosTable.columns.some((column) => column.name === 'estimate_time')) {
            await queryRunner.addColumn('task_todos', new typeorm_1.TableColumn({
                name: 'estimate_time',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }));
        }
        if (!(await queryRunner.hasTable('task_todo_users'))) {
            await queryRunner.createTable(new typeorm_1.Table({
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
            }));
        }
        await this.createIndexIfMissing(queryRunner, 'task_todo_users', new typeorm_1.TableIndex({
            name: 'IDX_TASK_TODO_USERS_TASK_TODO_ID',
            columnNames: ['task_todo_id'],
        }));
        await this.createIndexIfMissing(queryRunner, 'task_todo_users', new typeorm_1.TableIndex({
            name: 'IDX_TASK_TODO_USERS_USER_ID',
            columnNames: ['user_id'],
        }));
        await this.createIndexIfMissing(queryRunner, 'task_todo_users', new typeorm_1.TableIndex({
            name: 'UQ_TASK_TODO_USERS_TASK_TODO_USER',
            columnNames: ['task_todo_id', 'user_id'],
            isUnique: true,
        }));
        await this.createForeignKeyIfMissing(queryRunner, 'task_todo_users', 'task_todo_id', new typeorm_1.TableForeignKey({
            columnNames: ['task_todo_id'],
            referencedTableName: 'task_todos',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await this.createForeignKeyIfMissing(queryRunner, 'task_todo_users', 'user_id', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('task_todo_users', true);
    }
    async createIndexIfMissing(queryRunner, tableName, index) {
        const table = await queryRunner.getTable(tableName);
        if (!table?.indices.some((tableIndex) => tableIndex.name === index.name)) {
            await queryRunner.createIndex(tableName, index);
        }
    }
    async createForeignKeyIfMissing(queryRunner, tableName, columnName, foreignKey) {
        const table = await queryRunner.getTable(tableName);
        const exists = table?.foreignKeys.some((tableForeignKey) => tableForeignKey.columnNames.includes(columnName));
        if (!exists) {
            await queryRunner.createForeignKey(tableName, foreignKey);
        }
    }
}
exports.TaskTodoEstimatesUsers1712920000014 = TaskTodoEstimatesUsers1712920000014;
//# sourceMappingURL=1712920000014-task-todo-estimates-users.js.map