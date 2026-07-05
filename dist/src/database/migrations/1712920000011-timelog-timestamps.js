"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelogTimestamps1712920000011 = void 0;
const typeorm_1 = require("typeorm");
class TimelogTimestamps1712920000011 {
    async up(queryRunner) {
        await this.addColumnIfMissing(queryRunner, 'timelogs', new typeorm_1.TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
        }));
        await this.addColumnIfMissing(queryRunner, 'timelogs', new typeorm_1.TableColumn({
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
        }));
    }
    async down(queryRunner) {
        await this.dropColumnIfExists(queryRunner, 'timelogs', 'updated_at');
        await this.dropColumnIfExists(queryRunner, 'timelogs', 'created_at');
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
}
exports.TimelogTimestamps1712920000011 = TimelogTimestamps1712920000011;
//# sourceMappingURL=1712920000011-timelog-timestamps.js.map