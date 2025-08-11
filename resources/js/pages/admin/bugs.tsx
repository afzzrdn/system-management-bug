import React, { useState, useEffect, Fragment } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BugFormModal from '@/components/BugFormModal';
import { Listbox, Transition } from '@headlessui/react';

type Project = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
    role: 'developer' | 'client' | 'admin';
};

type Bug = {
    attachments: string[];
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved';
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
    // Menjadikan seluruh objek filters opsional
    filters?: {
        status?: string;
        project_id?: string;
        priority?: string;
    }
};

type BugFormData = {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved';
    attachments: File[];
    project_id: string;
    reported_by: string;
    assigned_to: string;
    resolved_at: string;
};

export default function Bugs() {
    // PERBAIKAN: Menambahkan nilai default {} untuk initialFilters
    const { bugs, projects, users, filters: initialFilters = {} } = usePage<PageProps>().props;
    
    const [activeTab, setActiveTab] = useState<'details' | 'attachments'>('details');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);

    const [filters, setFilters] = useState({
        status: initialFilters.status || '',
        project_id: initialFilters.project_id || '',
        priority: initialFilters.priority || ''
    });

    const initialFormValues: BugFormData = {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        attachments: [],
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
    };

    useEffect(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== '')
        );

        router.get(route('bugs.index'), activeFilters, {
            preserveState: true,
            replace: true,
            only: ['bugs', 'filters'], // Optimalisasi: hanya minta data 'bugs' saat filter
        });
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({ status: '', project_id: '', priority: '' });
    };

    const openAddModal = () => {
        setEditingBug(null);
        form.reset();
        setActiveTab('details');
        setIsModalOpen(true);
    };

    const openEditModal = (bug: Bug) => {
        setEditingBug(bug);
        form.setData({
            title: bug.title,
            description: bug.description,
            priority: bug.priority,
            status: bug.status,
            attachments: [],
            project_id: String(bug.project_id),
            reported_by: String(bug.reported_by),
            assigned_to: bug.assigned_to ? String(bug.assigned_to) : '',
            resolved_at: bug.resolved_at ?? ''
        });
        setActiveTab('details');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const onFinish = () => {
            form.reset();
            setActiveTab('details');
            closeModal();
        };

        const options = {
            onSuccess: onFinish,
            forceFormData: true
        };

        if (isEditing) {
            form.transform((data) => ({
                ...data,
                _method: 'PUT',
            }));
            form.post(route('bugs.update', editingBug!.id), options);
        } else {
            form.post(route('bugs.store'), options);
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
                <title>Management Bug</title>
            </Head>
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-400">Management Bug</h1>
                    <button onClick={openAddModal} className="inline-flex items-center justify-center gap-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                        <span>Tambah Bug</span>
                    </button>
                </div>
                
                {/* Modern Filter Section */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 items-end">

                        {/* Filter by Status (Pill Buttons) - Tidak ada perubahan di sini */}
                        <div className="lg:col-span-2">
                            <label className="text-sm font-medium text-slate-700 block mb-2">Filter by Status</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                        filters.status === ''
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Semua
                                </button>
                                {Object.entries(statusInfo).map(([key, { text }]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFilters(prev => ({ ...prev, status: key }))}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                            filters.status === key
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* === [UPGRADE] Filter by Priority (Modern Dropdown) === */}
                        <div>
                            <Listbox 
                                value={filters.priority} 
                                onChange={(value) => setFilters(prev => ({...prev, priority: value}))}
                            >
                                <div className="relative">
                                    <Listbox.Label className="text-sm font-medium text-slate-700 block mb-2">Prioritas</Listbox.Label>
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-slate-300 shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
                                        <span className="block truncate capitalize">{filters.priority || 'Semua Prioritas'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                                            <Listbox.Option value="" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}>
                                                {({ selected }) => ( <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Semua Prioritas</span> )}
                                            </Listbox.Option>
                                            {Object.keys(priorityClasses).map((prio) => (
                                                <Listbox.Option key={prio} value={prio} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}>
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate capitalize ${selected ? 'font-medium' : 'font-normal'}`}>{prio}</span>
                                                            {selected ? ( <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">✓</span> ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        {/* === [UPGRADE] Filter by Project (Modern Dropdown) === */}
                        <div>
                            <Listbox 
                                value={filters.project_id} 
                                onChange={(value) => setFilters(prev => ({...prev, project_id: value}))}
                            >
                                <div className="relative">
                                    <Listbox.Label className="text-sm font-medium text-slate-700 block mb-2">Proyek</Listbox.Label>
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-slate-300 shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
                                        <span className="block truncate">{projects.find(p => String(p.id) === filters.project_id)?.name || 'Semua Proyek'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                                            <Listbox.Option value="" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}>
                                                {({ selected }) => ( <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>Semua Proyek</span> )}
                                            </Listbox.Option>
                                            {projects.map((project) => (
                                                <Listbox.Option key={project.id} value={String(project.id)} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}>
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{project.name}</span>
                                                            {selected ? ( <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">✓</span> ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                    </div>

                    {/* Conditional Reset Button - Tidak ada perubahan di sini */}
                    {(filters.status || filters.project_id || filters.priority) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                            <button onClick={resetFilters} className="inline-flex items-center gap-x-2 px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-4.992-2.686h-4.992v.001M21.015 4.356v4.992m0 0h-4.992m4.992 0l-3.182-3.182a8.25 8.25 0 00-11.664 0L3.986 9.348" />
                                </svg>
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                    <div className="mt-6 space-y-4 text-sm">
                                        <div className="flex items-center space-x-5">
                                            <span className="font-semibold text-slate-500">Status: </span>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${statusInfo[bug.status].class}`}>
                                                {statusInfo[bug.status].text}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <span className="text-slate-600">Nama Project: <span className="font-medium text-slate-800">{bug.project?.name ?? 'N/A'}</span></span>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <span className="text-slate-600">Ditugaskan ke: <span className="font-medium text-slate-800">{bug.assignee?.name ?? 'N/A'}</span></span>
                                        </div>

                                        {bug.attachments && bug.attachments.length > 0 && (
                                            <div className="pt-4">
                                                <span className="block text-sm font-semibold text-slate-700 mb-2">Lampiran:</span>
                                                <div className="flex gap-2 flex-wrap">
                                                    {bug.attachments.map((file, i) => (
                                                        <a
                                                            key={i}
                                                            href={file}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline text-sm hover:text-blue-800"
                                                        >
                                                            Lampiran {i + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50/75 border-t border-slate-200 px-6 py-3 flex justify-end items-center space-x-4 rounded-b-xl">
                                    <button onClick={() => openEditModal(bug)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Edit</button>
                                    <button onClick={() => handleDelete(bug.id)} className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">Hapus</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-2 text-center p-12 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
                            <h3 className="mt-4 text-xl font-semibold text-slate-800">Tidak Ada Bug Ditemukan</h3>
                            <p className="mt-2 text-sm text-slate-500">Hasil filter tidak menemukan bug apa pun. Coba reset filter atau mulai lacak bug baru.</p>
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
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        </AppLayout>
    );
}