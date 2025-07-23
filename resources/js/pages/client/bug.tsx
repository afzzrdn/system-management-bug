import React, { useState } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BugFormModal from '@/components/BugFormModal';

// --- Tipe data (Types) tidak berubah ---
type Project = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type Bug = {
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
};

type PageProps = {
    bugs: Bug[];
    projects: Project[];
    users: User[];
};

type BugFormData = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  project_id: string;
  reported_by: string;
  assigned_to: string;
  resolved_at: string;
}

// --- Komponen Utama ---
export default function Bugs() {
    const { bugs, projects, users } = usePage<PageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);

    // --- Logika form dan modal tidak berubah ---
    const initialFormValues: BugFormData = {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        project_id: '',
        reported_by: '',
        assigned_to: '',
        resolved_at: ''
    };

    const form = useForm(initialFormValues);
    const isEditing = editingBug !== null;

    const openAddModal = () => {
        setEditingBug(null);
        form.reset();
        setIsModalOpen(true);
    };
    
    const openEditModal = (bug: Bug) => {
        setEditingBug(bug);
        form.setData({
            title: bug.title,
            description: bug.description,
            priority: bug.priority,
            status: bug.status,
            project_id: String(bug.project_id),
            reported_by: String(bug.reported_by),
            assigned_to: bug.assigned_to ? String(bug.assigned_to) : '',
            resolved_at: bug.resolved_at ?? ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const onFinish = () => {
        form.reset();
        closeModal();
        };

        if (isEditing) {
        form.put(route('bugs.update', editingBug!.id), { onSuccess: onFinish });
        } else {
        form.post(route('bugs.store'), { onSuccess: onFinish });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus bug ini?')) {
        router.delete(route('bugs.destroy', id));
        }
    };
    
    // --- Helper untuk styling badge prioritas ---
    const priorityClasses = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-200 text-red-800 border border-red-300';
            case 'high':
                return 'bg-orange-200 text-orange-800 border border-orange-300';
            case 'medium':
                return 'bg-yellow-200 text-yellow-800 border border-yellow-300';
            case 'low':
            default:
                return 'bg-blue-200 text-blue-800 border border-blue-300';
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>Manajemen Bug</title>
            </Head>
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-400">Daftar Bug</h1>
                    <button 
                        onClick={openAddModal} 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium shadow-sm transition-colors w-full sm:w-auto"
                    >
                        Tambah Bug
                    </button>
                </div>

                {/* --- Awal Perubahan: Tampilan Card --- */}
                <div className="space-y-4">
                    {bugs.length > 0 ? (
                        bugs.map((bug) => (
                            <div key={bug.id} className="bg-white shadow-lg rounded-lg p-5 w-full hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    {/* Kolom Kiri: Info Utama */}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses(bug.priority)}`}>
                                                {bug.priority}
                                            </span>
                                            <p className="text-sm font-medium text-indigo-600">{bug.project?.name}</p>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">{bug.title}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Dilaporkan oleh <span className="font-medium">{bug.reporter?.name}</span>
                                        </p>
                                    </div>
                                    
                                    {/* Kolom Kanan: Status & Aksi */}
                                    <div className="flex-shrink-0 flex flex-col items-start sm:items-end justify-between">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="text-sm text-gray-600">
                                                Status: <span className="font-semibold text-gray-800 capitalize">{bug.status.replace('_', ' ')}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                            <button onClick={() => openEditModal(bug)} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => handleDelete(bug.id)} className="text-sm font-medium text-red-600 hover:text-red-900">Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-12 bg-white rounded-lg shadow-md text-gray-500">
                            <p>🎉 Belum ada bug yang dilaporkan. Semuanya berjalan lancar!</p>
                        </div>
                    )}
                </div>
                {/* --- Akhir Perubahan --- */}
            </div>

            {/* Modal tidak berubah */}
            <BugFormModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onSubmit={handleSubmit} 
                isEditing={isEditing} 
                form={form} 
                projects={projects} 
                users={users} 
            />
        </AppLayout>
    );
}