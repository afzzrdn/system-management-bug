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


    return (
        <AppLayout>
        <Head>
            <title>Manajemen Bug</title>
        </Head>
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Bug</h1>
            <button onClick={openAddModal} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">Tambah Bug</button>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full table-auto">
                <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Judul</th>
                    <th className="px-6 py-3">Prioritas</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Proyek</th>
                    <th className="px-6 py-3">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {bugs.length > 0 ? (
                    bugs.map((bug, index) => (
                        <tr key={bug.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{bug.title}</div><div className="text-sm text-gray-500">{bug.reporter?.name}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bug.priority === 'high' || bug.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{bug.priority}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-gray-900">{bug.status.replace('_', ' ')}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{bug.project?.name}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4"><button onClick={() => openEditModal(bug)} className="text-indigo-600 hover:text-indigo-900">Edit</button><button onClick={() => handleDelete(bug.id)} className="text-red-600 hover:text-red-900">Hapus</button></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center p-8 text-gray-500">Belum ada bug yang dilaporkan.</td>
                    </tr>
                )}
                </tbody>
            </table>
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
        </div>
        </AppLayout>
    );
}