import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity('task_movement_histories')
export class TaskMovementHistoryEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  task_id: number;

  @Column({ type: 'int', unsigned: true })
  project_id: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  from_status: string | null;

  @Column({ type: 'varchar', length: 30 })
  to_status: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  from_order_index: number | null;

  @Column({ type: 'int', unsigned: true })
  to_order_index: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  moved_by: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  moved_at: Date;

  @ManyToOne(() => TaskEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'moved_by' })
  user: UserEntity | null;
}
