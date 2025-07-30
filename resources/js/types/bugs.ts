// @/types/bugs.ts
export type Bug = {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project_id: number;
    reporter: { id: number; name: string };
    attachments?: { id: number; file_url: string }[];
    version: string;
    created_at: string;
    updated_at: string;
};
