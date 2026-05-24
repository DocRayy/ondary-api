import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class NotificationsSchema1712920000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
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
          { name: 'user_id', type: 'int', unsigned: true },
          { name: 'title', type: 'varchar', length: '150' },
          { name: 'message', type: 'text' },
          { name: 'is_read', type: 'tinyint', width: 1, default: 0 },
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

    await queryRunner.createIndices('notifications', [
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_TASK_ID',
        columnNames: ['task_id'],
      }),
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_USER_ID',
        columnNames: ['user_id'],
      }),
      new TableIndex({
        name: 'IDX_NOTIFICATIONS_IS_READ',
        columnNames: ['is_read'],
      }),
    ]);

    await queryRunner.createForeignKeys('notifications', [
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications', true);
  }
}
