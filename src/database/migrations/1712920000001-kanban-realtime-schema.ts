import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class KanbanRealtimeSchema1712920000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('task', [
      new TableColumn({
        name: 'order_index',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
      new TableColumn({
        name: 'moved_at',
        type: 'datetime',
        isNullable: true,
      }),
      new TableColumn({
        name: 'completed_at',
        type: 'datetime',
        isNullable: true,
      }),
      new TableColumn({
        name: 'updated_by',
        type: 'int',
        unsigned: true,
        isNullable: true,
      }),
      new TableColumn({
        name: 'board_column',
        type: 'varchar',
        length: '30',
        default: "'draft'",
      }),
    ]);

    await queryRunner.query(
      `UPDATE task SET status = 'draft' WHERE status = 'pending'`,
    );
    await queryRunner.query(`UPDATE task SET board_column = status`);
    await queryRunner.changeColumn(
      'task',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '30',
        default: "'draft'",
      }),
    );

    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'task',
      new TableIndex({
        name: 'IDX_TASK_KANBAN',
        columnNames: ['project_id', 'board_column', 'order_index'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'task_movement_histories',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'task_id', type: 'int', unsigned: true },
          { name: 'project_id', type: 'int', unsigned: true },
          {
            name: 'from_status',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          { name: 'to_status', type: 'varchar', length: '30' },
          {
            name: 'from_order_index',
            type: 'int',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'to_order_index',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'moved_by',
            type: 'int',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'moved_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('task_movement_histories', [
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['moved_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task_movement_histories', true);
    await queryRunner.dropIndex('task', 'IDX_TASK_KANBAN');

    const table = await queryRunner.getTable('task');
    const updatedByForeignKey = table?.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes('updated_by'),
    );

    if (updatedByForeignKey) {
      await queryRunner.dropForeignKey('task', updatedByForeignKey);
    }

    await queryRunner.changeColumn(
      'task',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '30',
        default: "'pending'",
      }),
    );
    await queryRunner.dropColumns('task', [
      'board_column',
      'updated_by',
      'completed_at',
      'moved_at',
      'order_index',
    ]);
  }
}
