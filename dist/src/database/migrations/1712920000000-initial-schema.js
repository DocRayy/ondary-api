"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1712920000000 = void 0;
const typeorm_1 = require("typeorm");
class InitialSchema1712920000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'username', type: 'varchar', length: '50' },
                { name: 'email', type: 'varchar', length: '150' },
                { name: 'password', type: 'varchar', length: '255' },
                { name: 'name', type: 'varchar', length: '150' },
                { name: 'phone_no', type: 'varchar', length: '30', isNullable: true },
                { name: 'is_verified', type: 'tinyint', width: 1, default: 0 },
                { name: 'role', type: 'varchar', length: '30', default: "'member'" },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'active'",
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
            indices: [
                new typeorm_1.TableIndex({
                    name: 'IDX_USERS_USERNAME',
                    columnNames: ['username'],
                    isUnique: true,
                }),
                new typeorm_1.TableIndex({
                    name: 'IDX_USERS_EMAIL',
                    columnNames: ['email'],
                    isUnique: true,
                }),
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'projects',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'user_id', type: 'int', unsigned: true },
                { name: 'label', type: 'varchar', length: '120' },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'photo', type: 'varchar', length: '255', isNullable: true },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_labels',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'name', type: 'varchar', length: '80' },
                { name: 'color', type: 'varchar', length: '30' },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'project_id', type: 'int', unsigned: true },
                { name: 'user_id', type: 'int', unsigned: true },
                { name: 'title', type: 'varchar', length: '150' },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'due_date', type: 'datetime', isNullable: true },
                {
                    name: 'estimate_time',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
                { name: 'finish_date', type: 'datetime', isNullable: true },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'pending'",
                },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_users',
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
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_label_maps',
            columns: [
                { name: 'task_id', type: 'int', unsigned: true, isPrimary: true },
                {
                    name: 'task_label_id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_bookmarks',
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
                { name: 'label', type: 'varchar', length: '120' },
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_files',
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
                { name: 'url', type: 'varchar', length: '255', isNullable: true },
                {
                    name: 'file_path',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                { name: 'note', type: 'text', isNullable: true },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_todos',
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
                { name: 'user_id', type: 'int', unsigned: true, isNullable: true },
                { name: 'label', type: 'varchar', length: '150' },
                { name: 'progress', type: 'int', unsigned: true, default: 0 },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '30',
                    default: "'pending'",
                },
                {
                    name: 'estimate_time',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
                { name: 'due_date', type: 'datetime', isNullable: true },
                { name: 'finish_date', type: 'datetime', isNullable: true },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_todo_files',
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
                    isNullable: true,
                },
                { name: 'url', type: 'varchar', length: '255', isNullable: true },
                {
                    name: 'file_path',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                { name: 'note', type: 'text', isNullable: true },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'timelogs',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'user_id', type: 'int', unsigned: true },
                { name: 'task_todo_id', type: 'int', unsigned: true },
                { name: 'name', type: 'varchar', length: '150' },
                { name: 'time', type: 'varchar', length: '50', isNullable: true },
                { name: 'start', type: 'datetime', isNullable: true },
                { name: 'end', type: 'datetime', isNullable: true },
                { name: 'start_note', type: 'text', isNullable: true },
                { name: 'end_note', type: 'text', isNullable: true },
                {
                    name: 'minuted_logged',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'timelog_file',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'timelog_id', type: 'int', unsigned: true },
                {
                    name: 'file_url',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'file_path',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                { name: 'note', type: 'text', isNullable: true },
            ],
        }));
        await queryRunner.createForeignKeys('projects', [
            new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
        await queryRunner.createForeignKeys('task', [
            new typeorm_1.TableForeignKey({
                columnNames: ['project_id'],
                referencedTableName: 'projects',
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
        await queryRunner.createForeignKeys('task_users', [
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
        await queryRunner.createForeignKeys('task_label_maps', [
            new typeorm_1.TableForeignKey({
                columnNames: ['task_id'],
                referencedTableName: 'task',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['task_label_id'],
                referencedTableName: 'task_labels',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
        await queryRunner.createForeignKeys('task_bookmarks', [
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
        await queryRunner.createForeignKeys('task_files', [
            new typeorm_1.TableForeignKey({
                columnNames: ['task_id'],
                referencedTableName: 'task',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
        await queryRunner.createForeignKeys('task_todos', [
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
                onDelete: 'SET NULL',
            }),
        ]);
        await queryRunner.createForeignKeys('task_todo_files', [
            new typeorm_1.TableForeignKey({
                columnNames: ['task_todo_id'],
                referencedTableName: 'task_todos',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        ]);
        await queryRunner.createForeignKeys('timelogs', [
            new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['task_todo_id'],
                referencedTableName: 'task_todos',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
        await queryRunner.createForeignKeys('timelog_file', [
            new typeorm_1.TableForeignKey({
                columnNames: ['timelog_id'],
                referencedTableName: 'timelogs',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('timelog_file', true);
        await queryRunner.dropTable('timelogs', true);
        await queryRunner.dropTable('task_todo_files', true);
        await queryRunner.dropTable('task_todos', true);
        await queryRunner.dropTable('task_files', true);
        await queryRunner.dropTable('task_bookmarks', true);
        await queryRunner.dropTable('task_label_maps', true);
        await queryRunner.dropTable('task_users', true);
        await queryRunner.dropTable('task', true);
        await queryRunner.dropTable('task_labels', true);
        await queryRunner.dropTable('projects', true);
        await queryRunner.dropTable('users', true);
    }
}
exports.InitialSchema1712920000000 = InitialSchema1712920000000;
//# sourceMappingURL=1712920000000-initial-schema.js.map