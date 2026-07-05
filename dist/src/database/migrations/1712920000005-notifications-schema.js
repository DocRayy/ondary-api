"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsSchema1712920000005 = void 0;
const typeorm_1 = require("typeorm");
class NotificationsSchema1712920000005 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notifications',
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
                { name: 'user_id', type: 'int', unsigned: true },
                { name: 'title', type: 'varchar', length: '150' },
                { name: 'message', type: 'text' },
                { name: 'is_read', type: 'tinyint', width: 1, default: 0 },
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
        await queryRunner.createIndices('notifications', [
            new typeorm_1.TableIndex({
                name: 'IDX_NOTIFICATIONS_TASK_ID',
                columnNames: ['task_id'],
            }),
            new typeorm_1.TableIndex({
                name: 'IDX_NOTIFICATIONS_USER_ID',
                columnNames: ['user_id'],
            }),
            new typeorm_1.TableIndex({
                name: 'IDX_NOTIFICATIONS_IS_READ',
                columnNames: ['is_read'],
            }),
        ]);
        await queryRunner.createForeignKeys('notifications', [
            new typeorm_1.TableForeignKey({
                columnNames: ['task_id'],
                referencedTableName: 'task',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('notifications', true);
    }
}
exports.NotificationsSchema1712920000005 = NotificationsSchema1712920000005;
//# sourceMappingURL=1712920000005-notifications-schema.js.map