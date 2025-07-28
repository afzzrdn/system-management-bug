import React, { useState } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BugFormModal from '@/components/BugFormModal';

type Project = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type Bug = {
    attachment: File | null;
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
  attachment: File | null;
  project_id: string;
  reported_by: string;
  assigned_to: string;
  resolved_at: string;
}

export default function Bugs() {
    const { bugs, projects, users } = usePage<PageProps>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);

    const initialFormValues: BugFormData = {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        attachment: null,
        project_id: '',
        reported_by: '',
        assigned_to: '',
        resolved_at: ''
    };
    
    const form = useForm(initialFormValues);
    const isEditing = editingBug !== null;

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
            attachment: bug.attachment,
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
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-400">Manajemen Bug</h1>
                    <button onClick={openAddModal} className="inline-flex items-center justify-center gap-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                        <span>Tambah Bug</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 space-y-5">
                    {bugs.length > 0 ? (
                        bugs.map((bug) => (
                            <div key={bug.id}  className="bg-white border border-slate-200 rounded-xl flex flex-col transition-all duration-300 hover:shadow-lg hover:border-indigo-400/50 hover:-translate-y-1">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-lg font-bold text-slate-800 pr-2">{bug.title}</h3>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap ${priorityClasses[bug.priority]}`}>
                                            {bug.priority}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600 line-clamp-2" title={bug.description}>
                                        {bug.description}
                                    </p>
                                    
                                    <div className="mt-6 space-y-4 text-sm">
                                        <div className="flex items-center space-x-5">
                                            <span className="font-semibold text-slate-500">Status: </span>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${statusInfo[bug.status].class}`}>
                                                {statusInfo[bug.status].text}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                                              <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1H2V6Z" clipRule="evenodd" />
                                              <path d="M2 12a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2Z" />
                                            </svg>
                                            <span className="font-medium text-slate-700">{bug.project?.name ?? 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                                              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 0 0 .41-1.412A9.99 9.99 0 0 0 10 12.5a9.99 9.99 0 0 0-6.535 1.993Z" />
                                            </svg>
                                            <span className="text-slate-600">Ditugaskan ke: <span className="font-medium text-slate-800">{bug.assignee?.name ?? 'Belum ada'}</span></span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50/75 border-t border-slate-200 px-6 py-3 flex justify-end items-center space-x-4 rounded-b-xl">
                                    <button onClick={() => openEditModal(bug)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Edit</button>
                                    <button onClick={() => handleDelete(bug.id)} className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">Hapus</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-2 xl:col-span-3 text-center p-12 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-semibold text-slate-800">Tidak Ada Bug Ditemukan</h3>
                            <p className="mt-2 text-sm text-slate-500">Mulai lacak bug dengan mengeklik tombol "Tambah Bug".</p>
                        </div>
                    )}
                </div>

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