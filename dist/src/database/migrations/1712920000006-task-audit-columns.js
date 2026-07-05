"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAuditColumns1712920000006 = void 0;
const typeorm_1 = require("typeorm");
class TaskAuditColumns1712920000006 {
    async up(queryRunner) {
        await this.addColumnIfMissing(queryRunner, 'task', new typeorm_1.TableColumn({
            name: 'created_by',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, 'task', new typeorm_1.TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        }));
        await this.addColumnIfMissing(queryRunner, 'task', new typeorm_1.TableColumn({
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
        }));
        await this.addColumnIfMissing(queryRunner, 'task_todos', new typeorm_1.TableColumn({
            name: 'created_by',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, 'task_todos', new typeorm_1.TableColumn({
            name: 'updated_by',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, 'task_todos', new typeorm_1.TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        }));
        await this.addColumnIfMissing(queryRunner, 'task_todos', new typeorm_1.TableColumn({
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
        }));
        await this.addForeignKeyIfMissing(queryRunner, 'task', 'created_by');
        await this.addForeignKeyIfMissing(queryRunner, 'task_todos', 'created_by');
        await this.addForeignKeyIfMissing(queryRunner, 'task_todos', 'updated_by');
    }
    async down(queryRunner) {
        await this.dropColumnIfExists(queryRunner, 'task_todos', 'updated_at');
        await this.dropColumnIfExists(queryRunner, 'task_todos', 'created_at');
        await this.dropColumnIfExists(queryRunner, 'task_todos', 'updated_by');
        await this.dropColumnIfExists(queryRunner, 'task_todos', 'created_by');
        await this.dropColumnIfExists(queryRunner, 'task', 'updated_at');
        await this.dropColumnIfExists(queryRunner, 'task', 'created_at');
        await this.dropColumnIfExists(queryRunner, 'task', 'created_by');
    }
    async addColumnIfMissing(queryRunner, tableName, column) {
        const table = await queryRunner.getTable(tableName);
        if (!table || table.findColumnByName(column.name)) {
            return;
        }
        await queryRunner.addColumn(tableName, column);
    }
    async dropColumnIfExists(queryRunner, tableName, columnName) {
        const table = await queryRunner.getTable(tableName);
        if (!table?.findColumnByName(columnName)) {
            return;
        }
        await queryRunner.dropColumn(tableName, columnName);
    }
    async addForeignKeyIfMissing(queryRunner, tableName, columnName) {
        const table = await queryRunner.getTable(tableName);
        if (!table ||
            table.foreignKeys.some((foreignKey) => foreignKey.columnNames.includes(columnName))) {
            return;
        }
        await queryRunner.createForeignKey(tableName, new typeorm_1.TableForeignKey({
            columnNames: [columnName],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }
}
exports.TaskAuditColumns1712920000006 = TaskAuditColumns1712920000006;
//# sourceMappingURL=1712920000006-task-audit-columns.js.map