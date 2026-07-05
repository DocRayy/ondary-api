"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogs1712920000015 = void 0;
const typeorm_1 = require("typeorm");
class AuditLogs1712920000015 {
    async up(queryRunner) {
        if (!(await queryRunner.hasTable('audit_logs'))) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'audit_logs',
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
                        name: 'user_id',
                        type: 'int',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'user_role',
                        type: 'varchar',
                        length: '30',
                        isNullable: true,
                    },
                    { name: 'action', type: 'varchar', length: '50' },
                    { name: 'module', type: 'varchar', length: '80' },
                    {
                        name: 'table_name',
                        type: 'varchar',
                        length: '80',
                        isNullable: true,
                    },
                    { name: 'method', type: 'varchar', length: '20' },
                    { name: 'path', type: 'varchar', length: '255' },
                    {
                        name: 'route',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'resource_id',
                        type: 'varchar',
                        length: '80',
                        isNullable: true,
                    },
                    {
                        name: 'status_code',
                        type: 'int',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'duration_ms',
                        type: 'int',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '80',
                        isNullable: true,
                    },
                    {
                        name: 'user_agent',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    { name: 'query_params', type: 'json', isNullable: true },
                    { name: 'request_body', type: 'json', isNullable: true },
                    { name: 'old_values', type: 'json', isNullable: true },
                    { name: 'new_values', type: 'json', isNullable: true },
                    { name: 'changed_fields', type: 'json', isNullable: true },
                    { name: 'database_changes', type: 'json', isNullable: true },
                    { name: 'metadata', type: 'json', isNullable: true },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }));
        }
        await this.createIndexIfMissing(queryRunner, new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_LOGS_USER_ID',
            columnNames: ['user_id'],
        }));
        await this.createIndexIfMissing(queryRunner, new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_LOGS_ACTION',
            columnNames: ['action'],
        }));
        await this.createIndexIfMissing(queryRunner, new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_LOGS_MODULE',
            columnNames: ['module'],
        }));
        await this.createIndexIfMissing(queryRunner, new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_LOGS_CREATED_AT',
            columnNames: ['created_at'],
        }));
        const table = await queryRunner.getTable('audit_logs');
        const hasUserForeignKey = table?.foreignKeys.some((foreignKey) => foreignKey.columnNames.includes('user_id'));
        if (!hasUserForeignKey) {
            await queryRunner.createForeignKey('audit_logs', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('audit_logs', true);
    }
    async createIndexIfMissing(queryRunner, index) {
        const table = await queryRunner.getTable('audit_logs');
        if (!table?.indices.some((tableIndex) => tableIndex.name === index.name)) {
            await queryRunner.createIndex('audit_logs', index);
        }
    }
}
exports.AuditLogs1712920000015 = AuditLogs1712920000015;
//# sourceMappingURL=1712920000015-audit-logs.js.map