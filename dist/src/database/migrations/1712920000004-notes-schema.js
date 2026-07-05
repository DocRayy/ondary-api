"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesSchema1712920000004 = void 0;
const typeorm_1 = require("typeorm");
class NotesSchema1712920000004 {
    async up(queryRunner) {
        if (!(await queryRunner.hasTable('sticky_notes'))) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'sticky_notes',
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
                    { name: 'title', type: 'varchar', length: '150' },
                    { name: 'description', type: 'text', isNullable: true },
                ],
            }));
            await queryRunner.createForeignKey('sticky_notes', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }));
        }
        if (!(await queryRunner.hasTable('manager_notes'))) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'manager_notes',
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
                    { name: 'title', type: 'varchar', length: '150' },
                    { name: 'description', type: 'text', isNullable: true },
                ],
            }));
            await queryRunner.createForeignKey('manager_notes', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }));
        }
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('manager_notes')) {
            await queryRunner.dropTable('manager_notes', true);
        }
        if (await queryRunner.hasTable('sticky_notes')) {
            await queryRunner.dropTable('sticky_notes', true);
        }
    }
}
exports.NotesSchema1712920000004 = NotesSchema1712920000004;
//# sourceMappingURL=1712920000004-notes-schema.js.map