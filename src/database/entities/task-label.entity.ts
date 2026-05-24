import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task_labels')
export class TaskLabelEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 30 })
  color: string;
}
