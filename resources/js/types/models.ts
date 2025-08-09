export type Project = { id: number; name: string };
export type User = { id: number; name: string; role: 'developer' | 'client' | 'admin' };
export type Attachment = { id: number; file_path: string; file_name: string };
export type Bug = {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project_id: number;
    reported_by: number;
    assigned_to?: number | null;
    resolved_at?: string | null;
    project?: Project;
    reporter?: User;
    assignee?: User;
    attachments?: Attachment[];
};
