// types/project.ts
import type { Bug } from '@/types/bug';

export type Project = {
    id: number;
    name: string;
    description: string | null;
    client?: { id: number; name: string };
    bugs: Bug[];
    version?: string;
};
