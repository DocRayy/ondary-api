import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimelogEntity } from './timelog.entity';

@Entity('timelog_file')
export class TimelogFileEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  timelog_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_path: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @ManyToOne(() => TimelogEntity, (timelog) => timelog.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'timelog_id' })
  timelog: TimelogEntity;
}
