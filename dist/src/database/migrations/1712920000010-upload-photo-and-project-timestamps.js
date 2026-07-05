"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadPhotoAndProjectTimestamps1712920000010 = void 0;
const typeorm_1 = require("typeorm");
class UploadPhotoAndProjectTimestamps1712920000010 {
    async up(queryRunner) {
        await queryRunner.addColumns('projects', [
            new typeorm_1.TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
            new typeorm_1.TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }),
        ]);
        await queryRunner.addColumns('users', [
            new typeorm_1.TableColumn({
                name: 'photo',
                type: 'varchar',
                length: '255',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }),
        ]);
        await queryRunner.addColumn('timelog_file', new typeorm_1.TableColumn({
            name: 'photo',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('timelog_file', 'photo');
        await queryRunner.dropColumn('users', 'updated_at');
        await queryRunner.dropColumn('users', 'photo');
        await queryRunner.dropColumn('projects', 'updated_at');
        await queryRunner.dropColumn('projects', 'created_at');
    }
}
exports.UploadPhotoAndProjectTimestamps1712920000010 = UploadPhotoAndProjectTimestamps1712920000010;
//# sourceMappingURL=1712920000010-upload-photo-and-project-timestamps.js.map