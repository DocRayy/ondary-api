"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerNotesSoftDelete1712920000017 = void 0;
const typeorm_1 = require("typeorm");
class ManagerNotesSoftDelete1712920000017 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('manager_notes');
        if (!table?.columns.some((column) => column.name === 'deleted_at')) {
            await queryRunner.addColumn('manager_notes', new typeorm_1.TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('manager_notes');
        if (table?.columns.some((column) => column.name === 'deleted_at')) {
            await queryRunner.dropColumn('manager_notes', 'deleted_at');
        }
    }
}
exports.ManagerNotesSoftDelete1712920000017 = ManagerNotesSoftDelete1712920000017;
//# sourceMappingURL=1712920000017-manager-notes-soft-delete.js.map