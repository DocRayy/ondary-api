import { UserEntity } from './user.entity';
export declare class AuditLogEntity {
    id: number;
    user_id: number | null;
    username: string | null;
    user_role: string | null;
    action: string;
    module: string;
    table_name: string | null;
    method: string;
    path: string;
    route: string | null;
    resource_id: string | null;
    status_code: number | null;
    duration_ms: number | null;
    ip_address: string | null;
    user_agent: string | null;
    query_params: Record<string, unknown> | null;
    request_body: Record<string, unknown> | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    changed_fields: string[] | null;
    database_changes: Record<string, unknown>[] | null;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    user: UserEntity | null;
}
