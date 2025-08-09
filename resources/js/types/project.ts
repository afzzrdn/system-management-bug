// types/project.ts
import type { Bug } from './bugs';

export type Project = {
    id: number;
    name: string;
    description: string | null;
    client?: { id: number; name: string };
    bugs: Bug[];
    version?: string;
};
