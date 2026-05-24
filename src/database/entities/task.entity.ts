import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { TaskTodoEntity } from './task-todo.entity';
import { UserEntity } from './user.entity';

export type TaskFileItem = {
  url?: string | null;
  file_path?: string | null;
  note?: string | null;
};

export type TaskBookmarkItem = {
  user_id: number;
  label?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TaskMovementHistoryItem = {
  from_status: string | null;
  to_status: string;
  from_order_index: number | null;
  to_order_index: number;
  moved_by: number | null;
  moved_at: string;
};

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  project_id: number;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  task_todo_id: number | null;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'datetime', nullable: true })
  due_date: Date | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  estimate_time: number | null;

  @Column({ type: 'datetime', nullable: true })
  finish_date: Date | null;

  @Column({ type: 'varchar', length: 30, default: 'draft' })
  status: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  order_index: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  progress: number;

  @Column({ type: 'datetime', nullable: true })
  moved_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  created_by: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  updated_by: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'varchar', length: 30, default: 'draft' })
  board_column: string;

  @Column({ type: 'json', nullable: true })
  assignee_user_ids: number[] | null;

  @Column({ type: 'json', nullable: true })
  label_ids: number[] | null;

  @Column({ type: 'json', nullable: true })
  bookmarks: TaskBookmarkItem[] | null;

  @Column({ type: 'json', nullable: true })
  files: TaskFileItem[] | null;

  @Column({ type: 'json', nullable: true })
  movement_history: TaskMovementHistoryItem[] | null;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: UserEntity | null;

  @ManyToOne(() => TaskTodoEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'task_todo_id' })
  taskTodo: TaskTodoEntity | null;

  @OneToMany(() => TaskTodoEntity, (taskTodo) => taskTodo.task)
  todos: TaskTodoEntity[];
}
