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
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';
import { TimelogEntity } from './timelog.entity';

export type TaskTodoFileItem = {
  url?: string | null;
  file_path?: string | null;
  note?: string | null;
};

@Entity('task_todos')
export class TaskTodoEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  task_id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  user_id: number | null;

  @Column({ type: 'varchar', length: 150 })
  label: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  progress: number;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  estimate_time: number | null;

  @Column({ type: 'datetime', nullable: true })
  due_date: Date | null;

  @Column({ type: 'datetime', nullable: true })
  finish_date: Date | null;

  @Column({ type: 'json', nullable: true })
  files: TaskTodoFileItem[] | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  created_by: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  updated_by: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => TaskEntity, (task) => task.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (user) => user.taskTodos, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: UserEntity | null;

  @OneToMany(() => TimelogEntity, (timelog) => timelog.taskTodo)
  timelogs: TimelogEntity[];
}
