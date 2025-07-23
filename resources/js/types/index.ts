// Digunakan untuk link paginasi dari Laravel
export interface PageLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Struktur umum untuk data yang dipaginasi oleh Laravel
export interface Paginator<T> {
    data: T[];
    links: PageLink[];
    from: number;
    to: number;
    total: number;
}

// Definisi untuk User
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'developer' | 'client';
}

// Definisi untuk Project
export interface Project {
    id: number;
    name: string;
}

// Definisi untuk Bug
export interface Bug {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project_id: number;
    assigned_to?: User | null; // Relasi bisa null atau objek User
    project?: Project; // Relasi bisa objek Project
    created_at: string; // Tambahkan timestamp
}

// Definisi untuk Flash Message
export interface FlashMessage {
    success?: string | null;
    error?: string | null;
}
