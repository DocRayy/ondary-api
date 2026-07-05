"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelogStatus1712920000008 = void 0;
const typeorm_1 = require("typeorm");
class TimelogStatus1712920000008 {
    async up(queryRunner) {
        await this.addColumnIfMissing(queryRunner, 'timelogs', new typeorm_1.TableColumn({
            name: 'status',
            type: 'varchar',
            length: '30',
            default: "'active'",
        }));
        await queryRunner.query(`
      UPDATE timelogs
      SET status = CASE
        WHEN end IS NULL THEN 'active'
        ELSE 'pause'
      END
      WHERE status IS NULL OR status = ''
    `);
        await this.addIndexIfMissing(queryRunner, 'timelogs', new typeorm_1.TableIndex({
            name: 'IDX_TIMELOGS_STATUS',
            columnNames: ['status'],
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('timelogs');
        if (table?.findColumnByName('status')) {
            await queryRunner.dropColumn('timelogs', 'status');
        }
    }
    async addColumnIfMissing(queryRunner, tableName, column) {
        const table = await queryRunner.getTable(tableName);
        if (!table || table.findColumnByName(column.name)) {
            return;
        }
        await queryRunner.addColumn(tableName, column);
    }
    async addIndexIfMissing(queryRunner, tableName, index) {
        const table = await queryRunner.getTable(tableName);
        if (!table || table.indices.some((item) => item.name === index.name)) {
            return;
        }
        await queryRunner.createIndex(tableName, index);
    }
}
exports.TimelogStatus1712920000008 = TimelogStatus1712920000008;
//# sourceMappingURL=1712920000008-timelog-status.js.map