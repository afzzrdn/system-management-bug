export type Project = { id: number; name: string };
export type User = { id: number; name: string };
export type Attachment = { id: number; file_path: string; file_name: string };
export type Bug = {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project: Project;
    reporter: User;
    attachments?: Attachment[];
    version: string;
};
