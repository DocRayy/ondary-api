import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class TaskAttachmentsComments1712920000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('task_attachments'))) {
      await queryRunner.createTable(
        new Table({
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
        }),
      );
    }

    if (!(await queryRunner.hasTable('task_comments'))) {
      await queryRunner.createTable(
        new Table({
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
        }),
      );
    }

    await this.createIndexIfMissing(
      queryRunner,
      'task_attachments',
      new TableIndex({
        name: 'IDX_TASK_ATTACHMENTS_TASK_ID',
        columnNames: ['task_id'],
      }),
    );
    await this.createIndexIfMissing(
      queryRunner,
      'task_comments',
      new TableIndex({
        name: 'IDX_TASK_COMMENTS_TASK_ID',
        columnNames: ['task_id'],
      }),
    );
    await this.createIndexIfMissing(
      queryRunner,
      'task_comments',
      new TableIndex({
        name: 'IDX_TASK_COMMENTS_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await this.createForeignKeyIfMissing(
      queryRunner,
      'task_attachments',
      'task_id',
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await this.createForeignKeyIfMissing(
      queryRunner,
      'task_comments',
      'task_id',
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await this.createForeignKeyIfMissing(
      queryRunner,
      'task_comments',
      'user_id',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task_comments', true);
    await queryRunner.dropTable('task_attachments', true);
  }

  private async createIndexIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    index: TableIndex,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (!table?.indices.some((tableIndex) => tableIndex.name === index.name)) {
      await queryRunner.createIndex(tableName, index);
    }
  }

  private async createForeignKeyIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
    foreignKey: TableForeignKey,
  ) {
    const table = await queryRunner.getTable(tableName);
    const exists = table?.foreignKeys.some((tableForeignKey) =>
      tableForeignKey.columnNames.includes(columnName),
    );

    if (!exists) {
      await queryRunner.createForeignKey(tableName, foreignKey);
    }
  }
}
