"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralNotifications1712920000012 = void 0;
const typeorm_1 = require("typeorm");
class GeneralNotifications1712920000012 {
    async up(queryRunner) {
        await this.dropForeignKeyIfExists(queryRunner, 'notifications', 'task_id');
        await queryRunner.changeColumn('notifications', 'task_id', new typeorm_1.TableColumn({
            name: 'task_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, 'notifications', new typeorm_1.TableColumn({
            name: 'task_todo_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, 'notifications', new typeorm_1.TableColumn({
            name: 'manager_note_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, 'notifications', new typeorm_1.TableColumn({
            name: 'type',
            type: 'varchar',
            length: '50',
            default: "'task_status_updated'",
        }));
        await this.createIndexIfMissing(queryRunner, 'notifications', new typeorm_1.TableIndex({
            name: 'IDX_NOTIFICATIONS_TASK_TODO_ID',
            columnNames: ['task_todo_id'],
        }));
        await this.createIndexIfMissing(queryRunner, 'notifications', new typeorm_1.TableIndex({
            name: 'IDX_NOTIFICATIONS_MANAGER_NOTE_ID',
            columnNames: ['manager_note_id'],
        }));
        await this.createIndexIfMissing(queryRunner, 'notifications', new typeorm_1.TableIndex({
            name: 'IDX_NOTIFICATIONS_TYPE',
            columnNames: ['type'],
        }));
        await queryRunner.createForeignKeys('notifications', [
            new typeorm_1.TableForeignKey({
                columnNames: ['task_id'],
                referencedTableName: 'task',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['task_todo_id'],
                referencedTableName: 'task_todos',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['manager_note_id'],
                referencedTableName: 'manager_notes',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
    }
    async down(queryRunner) {
        await this.dropForeignKeyIfExists(queryRunner, 'notifications', 'task_id');
        await this.dropForeignKeyIfExists(queryRunner, 'notifications', 'task_todo_id');
        await this.dropForeignKeyIfExists(queryRunner, 'notifications', 'manager_note_id');
        await this.dropIndexIfExists(queryRunner, 'notifications', 'IDX_NOTIFICATIONS_TASK_TODO_ID');
        await this.dropIndexIfExists(queryRunner, 'notifications', 'IDX_NOTIFICATIONS_MANAGER_NOTE_ID');
        await this.dropIndexIfExists(queryRunner, 'notifications', 'IDX_NOTIFICATIONS_TYPE');
        await this.dropColumnIfExists(queryRunner, 'notifications', 'task_todo_id');
        await this.dropColumnIfExists(queryRunner, 'notifications', 'manager_note_id');
        await this.dropColumnIfExists(queryRunner, 'notifications', 'type');
        await queryRunner.query('DELETE FROM notifications WHERE task_id IS NULL');
        await queryRunner.changeColumn('notifications', 'task_id', new typeorm_1.TableColumn({
            name: 'task_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
        }));
        await queryRunner.createForeignKey('notifications', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedTableName: 'task',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async addColumnIfMissing(queryRunner, tableName, column) {
        if (!(await queryRunner.hasColumn(tableName, column.name))) {
            await queryRunner.addColumn(tableName, column);
        }
    }
    async dropColumnIfExists(queryRunner, tableName, columnName) {
        if (await queryRunner.hasColumn(tableName, columnName)) {
            await queryRunner.dropColumn(tableName, columnName);
        }
    }
    async createIndexIfMissing(queryRunner, tableName, index) {
        const table = await queryRunner.getTable(tableName);
        if (!table?.indices.some((tableIndex) => tableIndex.name === index.name)) {
            await queryRunner.createIndex(tableName, index);
        }
    }
    async dropIndexIfExists(queryRunner, tableName, indexName) {
        const table = await queryRunner.getTable(tableName);
        if (table?.indices.some((tableIndex) => tableIndex.name === indexName)) {
            await queryRunner.dropIndex(tableName, indexName);
        }
    }
    async dropForeignKeyIfExists(queryRunner, tableName, columnName) {
        const table = await queryRunner.getTable(tableName);
        const foreignKey = table?.foreignKeys.find((tableForeignKey) => tableForeignKey.columnNames.includes(columnName));
        if (foreignKey) {
            await queryRunner.dropForeignKey(tableName, foreignKey);
        }
    }
}
exports.GeneralNotifications1712920000012 = GeneralNotifications1712920000012;
//# sourceMappingURL=1712920000012-general-notifications.js.map