import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TaskLabelEntity } from './task-label.entity';
import { TaskEntity } from './task.entity';

@Entity('task_label_maps')
export class TaskLabelMapEntity {
  @PrimaryColumn({ type: 'int', unsigned: true })
  task_id: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  task_label_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => TaskEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => TaskLabelEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_label_id' })
  taskLabel: TaskLabelEntity;
}
