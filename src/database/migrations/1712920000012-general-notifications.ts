import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class GeneralNotifications1712920000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.dropForeignKeyIfExists(queryRunner, 'notifications', 'task_id');

    await queryRunner.changeColumn(
      'notifications',
      'task_id',
      new TableColumn({
        name: 'task_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );

    await this.addColumnIfMissing(
      queryRunner,
      'notifications',
      new TableColumn({
        name: 'task_todo_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'notifications',
      new TableColumn({
        name: 'manager_note_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
    );
    await this.addColumnIfMissing(
      queryRunner,
      'notifications',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        length: '50',
        default: "'task_status_updated'",
      }),
    );

    await this.createIndexIfMissing(
      queryRunner,
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_TASK_TODO_ID',
        columnNames: ['task_todo_id'],
      }),
    );
    await this.createIndexIfMissing(
      queryRunner,
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_MANAGER_NOTE_ID',
        columnNames: ['manager_note_id'],
      }),
    );
    await this.createIndexIfMissing(
      queryRunner,
      'notifications',
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_TYPE',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createForeignKeys('notifications', [
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['task_todo_id'],
        referencedTableName: 'task_todos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['manager_note_id'],
        referencedTableName: 'manager_notes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropForeignKeyIfExists(queryRunner, 'notifications', 'task_id');
    await this.dropForeignKeyIfExists(
      queryRunner,
      'notifications',
      'task_todo_id',
    );
    await this.dropForeignKeyIfExists(
      queryRunner,
      'notifications',
      'manager_note_id',
    );

    await this.dropIndexIfExists(
      queryRunner,
      'notifications',
      'IDX_NOTIFICATIONS_TASK_TODO_ID',
    );
    await this.dropIndexIfExists(
      queryRunner,
      'notifications',
      'IDX_NOTIFICATIONS_MANAGER_NOTE_ID',
    );
    await this.dropIndexIfExists(
      queryRunner,
      'notifications',
      'IDX_NOTIFICATIONS_TYPE',
    );

    await this.dropColumnIfExists(queryRunner, 'notifications', 'task_todo_id');
    await this.dropColumnIfExists(
      queryRunner,
      'notifications',
      'manager_note_id',
    );
    await this.dropColumnIfExists(queryRunner, 'notifications', 'type');

    await queryRunner.query('DELETE FROM notifications WHERE task_id IS NULL');
    await queryRunner.changeColumn(
      'notifications',
      'task_id',
      new TableColumn({
        name: 'task_id',
        type: 'int',
        unsigned: true,
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  private async addColumnIfMissing(
    queryRunner: QueryRunner,
    tableName: string,
    column: TableColumn,
  ) {
    if (!(await queryRunner.hasColumn(tableName, column.name))) {
      await queryRunner.addColumn(tableName, column);
    }
  }

  private async dropColumnIfExists(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ) {
    if (await queryRunner.hasColumn(tableName, columnName)) {
      await queryRunner.dropColumn(tableName, columnName);
    }
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

  private async dropIndexIfExists(
    queryRunner: QueryRunner,
    tableName: string,
    indexName: string,
  ) {
    const table = await queryRunner.getTable(tableName);
    if (table?.indices.some((tableIndex) => tableIndex.name === indexName)) {
      await queryRunner.dropIndex(tableName, indexName);
    }
  }

  private async dropForeignKeyIfExists(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ) {
    const table = await queryRunner.getTable(tableName);
    const foreignKey = table?.foreignKeys.find((tableForeignKey) =>
      tableForeignKey.columnNames.includes(columnName),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey(tableName, foreignKey);
    }
  }
}
