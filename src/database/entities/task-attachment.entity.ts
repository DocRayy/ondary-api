import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity('task_attachments')
export class TaskAttachmentEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  task_id: number;

  @Column({ type: 'varchar', length: 255 })
  files: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_path: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  original_name: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  mime_type: string | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  size: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => TaskEntity, (task) => task.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;
}
