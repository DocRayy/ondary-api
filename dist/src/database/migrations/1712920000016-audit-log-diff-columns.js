"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogDiffColumns1712920000016 = void 0;
const typeorm_1 = require("typeorm");
class AuditLogDiffColumns1712920000016 {
    async up(queryRunner) {
        await this.addColumnIfMissing(queryRunner, new typeorm_1.TableColumn({
            name: 'table_name',
            type: 'varchar',
            length: '80',
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, new typeorm_1.TableColumn({ name: 'old_values', type: 'json', isNullable: true }));
        await this.addColumnIfMissing(queryRunner, new typeorm_1.TableColumn({ name: 'new_values', type: 'json', isNullable: true }));
        await this.addColumnIfMissing(queryRunner, new typeorm_1.TableColumn({
            name: 'changed_fields',
            type: 'json',
            isNullable: true,
        }));
        await this.addColumnIfMissing(queryRunner, new typeorm_1.TableColumn({
            name: 'database_changes',
            type: 'json',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('audit_logs');
        for (const columnName of [
            'database_changes',
            'changed_fields',
            'new_values',
            'old_values',
            'table_name',
        ]) {
            if (table?.columns.some((column) => column.name === columnName)) {
                await queryRunner.dropColumn('audit_logs', columnName);
            }
        }
    }
    async addColumnIfMissing(queryRunner, column) {
        const table = await queryRunner.getTable('audit_logs');
        if (!table?.columns.some((tableColumn) => tableColumn.name === column.name)) {
            await queryRunner.addColumn('audit_logs', column);
        }
    }
}
exports.AuditLogDiffColumns1712920000016 = AuditLogDiffColumns1712920000016;
//# sourceMappingURL=1712920000016-audit-log-diff-columns.js.map