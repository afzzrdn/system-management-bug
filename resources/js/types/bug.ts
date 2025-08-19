import { User } from '@/types/user';
import { Project } from '@/types/project';
import { Attachment } from '@/types/Attachment';

export type BugType = 'Tampilan' | 'Performa' | 'Fitur' | 'Keamanan' | 'Error' | 'Lainnya';

export type Bug = {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    type: BugType;
    project: Project;
    reporter: User;
    assignee?: User | null;
    attachments?: Attachment[];
    version: string;
    created_at: string;
    updated_at: string;
    schedule_start_at: string | null;
    resolved_at: string | null;
    due_at: string | null;
    resolution_duration_for_humans: string | null;
};
