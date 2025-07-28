import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ProjectDetail from '@/components/ProjectDetail';

type Project = {
    id: number;
    name: string;
    description: string | null;
    client?: { id: number; name: string };
};

type PageProps = {
    projects?: Project[];
};

export default function ClientProjectsPage() {
    const { projects: projectsFromProps } = usePage<PageProps>().props;
    const projects = projectsFromProps || [];

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <AppLayout>
            <Head title="Project" />
            <div className="p-8">
                <h1 className="text-2xl font-semibold text-gray-400 mb-6">Project Saya</h1>
            </div>
            <div className="p-4 md:p-6 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-600">Nama Project</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Deskripsi</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length > 0 ? projects.map(project => (
                                    <tr key={project.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{project.name}</td>
                                        <td className="p-4 text-gray-700 truncate max-w-xs">{project.description}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedProject(project)}
                                                className="text-indigo-600 hover:underline font-semibold"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-8 text-gray-500">Tidak ada project yang ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </AppLayout>
    );
}
