import { User } from '@/types/user';
import { Project } from '@/types/project';
import { Attachment } from '@/types/Attachment';

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
