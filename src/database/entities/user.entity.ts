import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ManagerNoteEntity } from './manager-note.entity';
import { StickyNoteEntity } from './sticky-note.entity';
import { TaskEntity } from './task.entity';
import { TaskTodoEntity } from './task-todo.entity';
import { TimelogEntity } from './timelog.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone_no: string | null;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'varchar', length: 30, default: 'member' })
  role: string;

  @Column({ type: 'varchar', length: 30, default: 'active' })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ProjectEntity, (project) => project.user)
  projects: ProjectEntity[];

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  @OneToMany(() => TaskTodoEntity, (taskTodo) => taskTodo.user)
  taskTodos: TaskTodoEntity[];

  @OneToMany(() => TimelogEntity, (timelog) => timelog.user)
  timelogs: TimelogEntity[];

  @OneToMany(() => StickyNoteEntity, (stickyNote) => stickyNote.user)
  stickyNotes: StickyNoteEntity[];

  @OneToMany(() => ManagerNoteEntity, (managerNote) => managerNote.user)
  managerNotes: ManagerNoteEntity[];
}
