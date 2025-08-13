export interface PageLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginator<T> {
    data: T[];
    links: PageLink[];
    from: number;
    to: number;
    total: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'developer' | 'client';
}

export interface Project {
    id: number;
    name: string;
}

export interface Bug {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project_id: number;
    assigned_to?: User | null;
    project?: Project;
    created_at: string;
}

export interface FlashMessage {
    success?: string | null;
    error?: string | null;
}
