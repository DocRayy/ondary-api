import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskTodoEntity } from './task-todo.entity';

@Entity('task_todo_files')
export class TaskTodoFileEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  task_todo_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_path: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @ManyToOne(() => TaskTodoEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_todo_id' })
  taskTodo: TaskTodoEntity;
}
