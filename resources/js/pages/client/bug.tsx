import React, { useState } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BugFormModal from '@/components/BugReportModal';
import BugDetail from '@/components/BugDetail';
import { Eye } from 'lucide-react';
import type { Bug } from '@/types/bug';

// --- TYPE DEFINITIONS ---
type Project = { id: number; name: string; };
type User = { id: number; name: string; role: 'developer' | 'client' | 'admin'; };
type Attachment = { id: number; file_path: string; file_name: string; };
type PageProps = { bugs: Bug[]; projects: Project[]; users: User[]; };

// --- FORM DATA TYPE ---
export type BugFormData = {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    attachments: File[];
    project_id: string;
    assigned_to: string;
};

export default function Bugs() {
    const { bugs = [], projects = [], users = [] } = usePage<PageProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);

    // state untuk modal detail
    const [detailBug, setDetailBug] = useState<Bug | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const initialFormValues: BugFormData = {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        attachments: [],
        project_id: '',
        assigned_to: '',
    };

    const { data, setData, post, processing, errors, reset, transform } = useForm(initialFormValues);
    const isEditing = editingBug !== null;

    // --- HELPER OBJECTS FOR STYLING ---
    const priorityClasses = {
        low: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
        medium: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200',
        high: 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200',
        critical: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200',
    };
    const statusInfo = {
        open: { text: 'Open', class: 'text-blue-600 bg-blue-100' },
        in_progress: { text: 'In Progress', class: 'text-yellow-600 bg-yellow-100' },
        resolved: { text: 'Resolved', class: 'text-green-600 bg-green-100' },
        closed: { text: 'Closed', class: 'text-gray-600 bg-gray-100' },
    };

    // --- MODAL & FORM HANDLERS ---
    const openAddModal = () => {
        setEditingBug(null);
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBug(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const onFinish = () => closeModal();

        transform((data) => ({
            ...data,
            description: data.description || '-',
            priority: data.priority || 'low',
            status: data.status || 'open',
            assigned_to: data.assigned_to || '',
            ...(isEditing ? { _method: 'put' } : {}),
        }));

        if (isEditing) {
            post(route('client.bugs.update', editingBug!.id), { onSuccess: onFinish, forceFormData: true });
        } else {
            post(route('client.bugs.store'), { onSuccess: onFinish, forceFormData: true });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus bug ini?')) {
            router.delete(route('bugs.destroy', id), { preserveScroll: true });
        }
    };

    const handleViewDetail = (bug: Bug) => {
        setDetailBug(bug);
        setIsDetailOpen(true);
    };

    return (
        <AppLayout>
            <Head><title>Manajemen Bug</title></Head>
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">Manajemen Bug</h1>
                    <button onClick={openAddModal} className="inline-flex items-center justify-center gap-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                        <span>Tambah Laporan Bug</span>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Judul</th>
                                <th scope="col" className="px-6 py-3">Project</th>
                                <th scope="col" className="px-6 py-3">Prioritas</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ditugaskan ke</th>
                                <th scope="col" className="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bugs.length > 0 ? (
                                bugs.map((bug) => (
                                    <tr key={bug.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{bug.title}</td>
                                        <td className="px-6 py-4">{bug.project?.name ?? 'N/A'}</td>
                                        <td className="px-6 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap ${priorityClasses[bug.priority]}`}>{bug.priority}</span></td>
                                        <td className="px-6 py-4"><span className={`px-2 py-0.5 text-xs font-medium rounded-md ${statusInfo[bug.status].class}`}>{statusInfo[bug.status].text}</span></td>
                                        <td className="px-6 py-4">{bug.assignee?.name ?? 'Belum ada'}</td>
                                        <td className="px-6 py-4 flex items-center space-x-3">
                                            <button onClick={() => handleViewDetail(bug)} className="text-blue-600 hover:underline flex items-center gap-1">
                                                <Eye className="w-4 h-4" /> Lihat
                                            </button>
                                            <button onClick={() => handleDelete(bug.id)} className="font-medium text-red-600 hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-12 bg-white border-b">
                                        <h3 className="text-xl font-semibold text-slate-800">Tidak Ada Bug Ditemukan</h3>
                                        <p className="mt-2 text-sm text-slate-500">Mulai lacak bug dengan mengeklik tombol "Tambah Laporan Bug".</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <BugFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} isEditing={isEditing} form={{ data, setData, errors, processing }} projects={projects} users={users} editingBug={editingBug} />

                {detailBug && (
                    <BugDetail
                        bug={detailBug}
                        isOpen={isDetailOpen}
                        onClose={() => setIsDetailOpen(false)}
                    />
                )}
            </div>
        </AppLayout>
    );
}
