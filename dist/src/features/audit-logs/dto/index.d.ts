export declare class FindAuditLogsQuery {
    page?: number;
    limit?: number;
    action?: string;
    module?: string;
    user_id?: number;
    from_date?: string;
    to_date?: string;
    date_range?: '7d' | '30d' | '90d' | 'all';
    search?: string;
}
