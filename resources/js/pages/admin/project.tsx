import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Fragment, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ProjectDetailModal from '@/components/ProjectDetail';
import ProjectTable from '@/components/ProjectTable';
import ProjectFormModal from '@/components/FormProject';

type Project = {
    id: number;
    name: string;
    description: string | null;
    client_id: number;
    client?: { id: number; name: string };
};

type Client = {
    id: number;
    name: string;
};

interface CustomPageProps {
    projects: Project[];
    clients: Client[];
    flash?: {
        success?: string;
    };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function ProjectIndex() {
    // --- STATE MANAGEMENT ---
    const {
        projects = [],
        clients = [],
        flash = {},
        errors = {},
    } = usePage<CustomPageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const openDetailModal = (project: Project) => {
        setSelectedProject(project);
    };

    const closeDetailModal = () => {
        setSelectedProject(null);
    };

    const {
        data,
        setData,
        post,
        put,
        reset,
        delete: destroy,
        processing,
    } = useForm({
        name: '',
        description: '',
        client_id: '',
    });

    const openModalForCreate = () => {
        reset();
        setEditingProjectId(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (project: Project) => {
        setData({
            name: project.name,
            description: project.description ?? '',
            client_id: project.client_id.toString(),
        });
        setEditingProjectId(project.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => closeModal(),
            preserveScroll: true,
        };

        if (editingProjectId) {
            put(route('projects.update', editingProjectId), options);
        } else {
            post(route('projects.store'), options);
        }
    };

    const handleDelete = (project: Project) => {
        if (confirm('Apakah Anda yakin ingin menghapus project ini?')) {
            destroy(route('projects.destroy', project.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Project" />

            {/* Main Page Content */}
            <div className="p-8 max-w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-400">Management Project</h2>
                    <button
                        onClick={openModalForCreate}
                        className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {/* Menggunakan ikon Plus dari Lucide */}
                        <Plus size={20} />
                        Tambah Project
                    </button>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6" role="alert">
                        <p className="font-bold">Sukses</p>
                        <p>{flash.success}</p>
                    </div>
                )}

                {/* Projects Table */}
                <ProjectTable
                    projects={projects}
                    onEdit={openModalForEdit}
                    onDelete={handleDelete}
                    onDetail={openDetailModal}
                />
            </div>
            {/* Form Modal using Headless UI */}
            <ProjectFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                isEditing={!!editingProjectId}
                processing={processing}
                data={data}
                setData={setData}
                errors={errors}
                clients={clients}
            />

            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={closeDetailModal}
                />
            )}
        </AppLayout>
    );
}
