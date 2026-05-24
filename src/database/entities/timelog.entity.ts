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
import { TaskTodoEntity } from './task-todo.entity';
import { TimelogFileEntity } from './timelog-file.entity';
import { UserEntity } from './user.entity';

@Entity('timelogs')
export class TimelogEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  task_todo_id: number | null;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time: string | null;

  @Column({ type: 'varchar', length: 30, default: 'active' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  start: Date | null;

  @Column({ type: 'datetime', nullable: true })
  end: Date | null;

  @Column({ type: 'text', nullable: true })
  start_note: string | null;

  @Column({ type: 'text', nullable: true })
  end_note: string | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  minuted_logged: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.timelogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => TaskTodoEntity, (taskTodo) => taskTodo.timelogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'task_todo_id' })
  taskTodo: TaskTodoEntity | null;

  @OneToMany(() => TimelogFileEntity, (file) => file.timelog)
  files: TimelogFileEntity[];
}
