"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanRealtimeSchema1712920000001 = void 0;
const typeorm_1 = require("typeorm");
class KanbanRealtimeSchema1712920000001 {
    async up(queryRunner) {
        await queryRunner.addColumns('task', [
            new typeorm_1.TableColumn({
                name: 'order_index',
                type: 'int',
                unsigned: true,
                default: 0,
            }),
            new typeorm_1.TableColumn({
                name: 'moved_at',
                type: 'datetime',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'completed_at',
                type: 'datetime',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'updated_by',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'board_column',
                type: 'varchar',
                length: '30',
                default: "'draft'",
            }),
        ]);
        await queryRunner.query(`UPDATE task SET status = 'draft' WHERE status = 'pending'`);
        await queryRunner.query(`UPDATE task SET board_column = status`);
        await queryRunner.changeColumn('task', 'status', new typeorm_1.TableColumn({
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'draft'",
        }));
        await queryRunner.createForeignKey('task', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('task', new typeorm_1.TableIndex({
            name: 'IDX_TASK_KANBAN',
            columnNames: ['project_id', 'board_column', 'order_index'],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_movement_histories',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'task_id', type: 'int', unsigned: true },
                { name: 'project_id', type: 'int', unsigned: true },
                {
                    name: 'from_status',
                    type: 'varchar',
                    length: '30',
                    isNullable: true,
                },
                { name: 'to_status', type: 'varchar', length: '30' },
                {
                    name: 'from_order_index',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
                {
                    name: 'to_order_index',
                    type: 'int',
                    unsigned: true,
                },
                {
                    name: 'moved_by',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
                {
                    name: 'moved_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createForeignKeys('task_movement_histories', [
            new typeorm_1.TableForeignKey({
                columnNames: ['task_id'],
                referencedTableName: 'task',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['project_id'],
                referencedTableName: 'projects',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['moved_by'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('task_movement_histories', true);
        await queryRunner.dropIndex('task', 'IDX_TASK_KANBAN');
        const table = await queryRunner.getTable('task');
        const updatedByForeignKey = table?.foreignKeys.find((foreignKey) => foreignKey.columnNames.includes('updated_by'));
        if (updatedByForeignKey) {
            await queryRunner.dropForeignKey('task', updatedByForeignKey);
        }
        await queryRunner.changeColumn('task', 'status', new typeorm_1.TableColumn({
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'pending'",
        }));
        await queryRunner.dropColumns('task', [
            'board_column',
            'updated_by',
            'completed_at',
            'moved_at',
            'order_index',
        ]);
    }
}
exports.KanbanRealtimeSchema1712920000001 = KanbanRealtimeSchema1712920000001;
//# sourceMappingURL=1712920000001-kanban-realtime-schema.js.map