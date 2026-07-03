import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index('IDX_AUDIT_LOGS_USER_ID')
  @Column({ type: 'int', unsigned: true, nullable: true })
  user_id: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  user_role: string | null;

  @Index('IDX_AUDIT_LOGS_ACTION')
  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Index('IDX_AUDIT_LOGS_MODULE')
  @Column({ type: 'varchar', length: 80 })
  module: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  table_name: string | null;

  @Column({ type: 'varchar', length: 20 })
  method: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  route: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  resource_id: string | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  status_code: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  duration_ms: number | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  ip_address: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_agent: string | null;

  @Column({ type: 'json', nullable: true })
  query_params: Record<string, unknown> | null;

  @Column({ type: 'json', nullable: true })
  request_body: Record<string, unknown> | null;

  @Column({ type: 'json', nullable: true })
  old_values: Record<string, unknown> | null;

  @Column({ type: 'json', nullable: true })
  new_values: Record<string, unknown> | null;

  @Column({ type: 'json', nullable: true })
  changed_fields: string[] | null;

  @Column({ type: 'json', nullable: true })
  database_changes: Record<string, unknown>[] | null;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null;

  @Index('IDX_AUDIT_LOGS_CREATED_AT')
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;
}
