import { User } from '@/types/user'
import { Project } from '@/types/project'
import { Attachment } from '@/types/Attachment';

export type Bug = {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project: Project;
    reporter: User;
    assignee?: User | null;
    attachments?: Attachment[];
    version: string;
    created_at: string;
    updated_at: string;
};
