import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { TaskTodoEntity } from './task-todo.entity';
import { UserEntity } from './user.entity';

@Entity('task_todo_users')
export class TaskTodoUserEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  task_todo_id: number;

  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => TaskTodoEntity, (taskTodo) => taskTodo.todoUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_todo_id' })
  taskTodo: TaskTodoEntity;

  @ManyToOne(() => UserEntity, (user) => user.taskTodoAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
