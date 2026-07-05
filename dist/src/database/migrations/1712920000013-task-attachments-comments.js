"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAttachmentsComments1712920000013 = void 0;
const typeorm_1 = require("typeorm");
class TaskAttachmentsComments1712920000013 {
    async up(queryRunner) {
        if (!(await queryRunner.hasTable('task_attachments'))) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'task_attachments',
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
                        name: 'task_id',
                        type: 'int',
                        unsigned: true,
                    },
                    {
                        name: 'files',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'file_path',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'original_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'mime_type',
                        type: 'varchar',
                        length: '150',
                        isNullable: true,
                    },
                    {
                        name: 'size',
                        type: 'int',
                        unsigned: true,
                        isNullable: true,
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
        if (!(await queryRunner.hasTable('task_comments'))) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'task_comments',
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
                        name: 'task_id',
                        type: 'int',
                        unsigned: true,
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        unsigned: true,
                    },
                    {
                        name: 'message',
                        type: 'text',
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
        await this.createIndexIfMissing(queryRunner, 'task_attachments', new typeorm_1.TableIndex({
            name: 'IDX_TASK_ATTACHMENTS_TASK_ID',
            columnNames: ['task_id'],
        }));
        await this.createIndexIfMissing(queryRunner, 'task_comments', new typeorm_1.TableIndex({
            name: 'IDX_TASK_COMMENTS_TASK_ID',
            columnNames: ['task_id'],
        }));
        await this.createIndexIfMissing(queryRunner, 'task_comments', new typeorm_1.TableIndex({
            name: 'IDX_TASK_COMMENTS_USER_ID',
            columnNames: ['user_id'],
        }));
        await this.createForeignKeyIfMissing(queryRunner, 'task_attachments', 'task_id', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedTableName: 'task',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await this.createForeignKeyIfMissing(queryRunner, 'task_comments', 'task_id', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedTableName: 'task',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await this.createForeignKeyIfMissing(queryRunner, 'task_comments', 'user_id', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('task_comments', true);
        await queryRunner.dropTable('task_attachments', true);
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
exports.TaskAttachmentsComments1712920000013 = TaskAttachmentsComments1712920000013;
//# sourceMappingURL=1712920000013-task-attachments-comments.js.map