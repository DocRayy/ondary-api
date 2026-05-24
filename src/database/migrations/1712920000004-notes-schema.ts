import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class NotesSchema1712920000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('sticky_notes'))) {
      await queryRunner.createTable(
        new Table({
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
        }),
      );

      await queryRunner.createForeignKey(
        'sticky_notes',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    if (!(await queryRunner.hasTable('manager_notes'))) {
      await queryRunner.createTable(
        new Table({
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
        }),
      );

      await queryRunner.createForeignKey(
        'manager_notes',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('manager_notes')) {
      await queryRunner.dropTable('manager_notes', true);
    }

    if (await queryRunner.hasTable('sticky_notes')) {
      await queryRunner.dropTable('sticky_notes', true);
    }
  }
}
