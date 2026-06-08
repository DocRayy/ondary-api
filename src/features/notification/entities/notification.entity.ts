import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskEntity } from '../../../database/entities/task.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { ManagerNoteEntity } from '../../../database/entities/manager-note.entity';
import { TaskTodoEntity } from '../../../database/entities/task-todo.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  task_id: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  task_todo_id: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  manager_note_id: number | null;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'varchar', length: 50, default: 'task_status_updated' })
  type: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity | null;

  @ManyToOne(() => TaskTodoEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'task_todo_id' })
  taskTodo: TaskTodoEntity | null;

  @ManyToOne(() => ManagerNoteEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'manager_note_id' })
  managerNote: ManagerNoteEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
