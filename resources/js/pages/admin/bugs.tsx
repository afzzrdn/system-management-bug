import { User } from '@/types/user';
import { Project } from '@/types/project';
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BugFormModal from '@/components/BugFormModal';
import { Listbox, Transition } from '@headlessui/react';
import { useTour } from '@/tour/TourProvider';
import { Bug, BugType } from '@/types/bug';

const PRIORITY_CLASSES = {
    low: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200',
    high: 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200',
    critical: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200',
};

const STATUS_INFO = {
    open: { text: 'Open', class: 'text-blue-600 bg-blue-100' },
    in_progress: { text: 'In Progress', class: 'text-yellow-600 bg-yellow-100' },
    resolved: { text: 'Resolved', class: 'text-green-600 bg-green-100' },
    closed: { text: 'Closed', class: 'text-slate-700 bg-slate-100' },
};

const BUG_TYPES: BugType[] = ['Tampilan', 'Performa', 'Fitur', 'Keamanan', 'Error', 'Lainnya'];

// --- REFACTOR: Komponen dropdown filter yang dapat digunakan kembali ---
type FilterDropdownProps<T extends string | number> = {
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: { value: T; label: string }[];
    placeholder: string;
    tourId?: string;
};

function FilterDropdown<T extends string | number>({ label, value, onChange, options, placeholder, tourId }: FilterDropdownProps<T>) {
    const selectedLabel = options.find(opt => String(opt.value) === String(value))?.label || placeholder;

    return (
        <div data-tour={tourId}>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Label className="text-sm font-medium text-slate-700 block mb-2">{label}</Listbox.Label>
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-slate-300 shadow-sm focus:outline-none sm:text-sm">
                        <span className="block truncate capitalize">{selectedLabel}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                            <Listbox.Option value="" className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}>
                                <span className="block truncate font-normal">{placeholder}</span>
                            </Listbox.Option>
                            {options.map((option) => (
                                <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}>
                                    <span className="block truncate capitalize">{option.label}</span>
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}

// --- Tipe Halaman & Form ---
type PageProps = {
    bugs: Bug[];
    projects: Project[];
    users: User[];
    filters?: { status?: string; project_id?: string; priority?: string; type?: string };
};

// PERBAIKAN: Tipe form disesuaikan agar lebih akurat
type BugFormData = {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    type: BugType | '';
    attachments: (File | string | null)[];
    project_id: string | number;
    assignee_id: string | number; // Menggunakan assignee_id untuk konsistensi
    schedule_start_at: string | null;
    resolved_at: string | null;
    due_at: string | null;
};

export default function Bugs() {
    const { bugs, projects, users, filters: initialFilters = {} } = usePage<PageProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);
    const [filters, setFilters] = useState({ status: initialFilters.status || '', project_id: initialFilters.project_id || '', priority: initialFilters.priority || '', type: initialFilters.type || '' });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { start } = useTour();

    // PERBAIKAN: Nilai awal form yang lebih lengkap dan akurat
    const initialFormValues: BugFormData = {
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        type: '',
        attachments: [],
        project_id: '',
        assignee_id: '',
        schedule_start_at: null,
        resolved_at: null,
        due_at: null,
    };

    const form = useForm(initialFormValues);
    const isEditing = editingBug !== null;

    useEffect(() => {
        const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
        router.get(route('bugs.index'), activeFilters, { preserveState: true, replace: true, only: ['bugs', 'filters'] });
    }, [filters]);

    const resetFilters = () => setFilters({ status: '', project_id: '', priority: '', type: '' });

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
            type: bug.type,
            attachments: [],
            project_id: bug.project.id,
            assignee_id: bug.assignee?.id ?? '', 
            schedule_start_at: bug.schedule_start_at,
            resolved_at: bug.resolved_at,
            due_at: bug.due_at,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const onFinish = () => { form.reset(); closeModal(); };
        const options = { onSuccess: onFinish, forceFormData: true };

        if (isEditing && editingBug) {
            form.put(route('bugs.update', editingBug.id), options);
        } else {
            form.post(route('bugs.store'), options);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus bug ini?')) {
            router.delete(route('bugs.destroy', id));
        }
    };

    const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);

    const projectOptions = useMemo(() => projects.map(p => ({ value: String(p.id), label: p.name })), [projects]);
    const priorityOptions = useMemo(() => Object.keys(PRIORITY_CLASSES).map(p => ({ value: p, label: p })), []);
    const bugTypeOptions = useMemo(() => BUG_TYPES.map(t => ({ value: t, label: t })), []);

    const runTour = () => {
        start([
            { element: '[data-tour="filters-status"]',   popover: { title: 'Filter Status', description: 'Klik untuk membatasi daftar berdasarkan status tiket.' } },
            { element: '[data-tour="filters-priority"]', popover: { title: 'Filter Prioritas', description: 'Pilih prioritas tiket yang ingin difokuskan.' } },
            { element: '[data-tour="filters-project"]',  popover: { title: 'Filter Proyek', description: 'Tampilkan tiket untuk proyek tertentu.' } },
            { element: '[data-tour="filters-type"]',     popover: { title: 'Jenis Bug', description: 'Saring berdasarkan kategori bug.' } },
            { element: '[data-tour="add-bug"]',          popover: { title: 'Tambah Bug', description: 'Buat tiket baru lengkap dengan lampiran dan prioritas.' } },
            { element: '[data-tour="bug-grid"]',         popover: { title: 'Kartu Bug', description: 'Ringkasan tiap tiket. Arahkan kursor untuk aksi cepat.' } },
            { element: '[data-tour="card-actions"]',     popover: { title: 'Aksi', description: 'Edit atau hapus tiket dari sini.' } },
        ], { cursor: false, headerOffsetPx: 64 });
    };

    return (
        <AppLayout>
            <Head><title>Management Bug</title></Head>
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-400">Management Bug</h1>
                    <div className="flex items-center gap-3">
                        <button onClick={runTour} className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-slate-700 hover:bg-gray-50">Tutorial</button>
                        <button data-tour="add-bug" onClick={openAddModal} className="inline-flex items-center justify-center gap-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                            <span>Tambah Bug</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 items-end">
                        <div className="lg:col-span-4" data-tour="filters-status">
                            <label className="text-sm font-medium text-slate-700 block mb-2">Filter by Status</label>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setFilters(prev => ({ ...prev, status: '' }))} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filters.status === '' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Semua</button>
                                {Object.entries(STATUS_INFO).map(([key, { text }]) => (<button key={key} type="button" onClick={() => setFilters(prev => ({ ...prev, status: key }))} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filters.status === key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{text}</button>))}
                            </div>
                        </div>

                        <FilterDropdown label="Prioritas" value={filters.priority} onChange={(v) => setFilters(p => ({ ...p, priority: v }))} options={priorityOptions} placeholder="Semua Prioritas" tourId="filters-priority" />
                        <FilterDropdown label="Proyek" value={filters.project_id} onChange={(v) => setFilters(p => ({ ...p, project_id: v }))} options={projectOptions} placeholder="Semua Proyek" tourId="filters-project" />
                        <FilterDropdown label="Jenis Bug" value={filters.type} onChange={(v) => setFilters(p => ({ ...p, type: v }))} options={bugTypeOptions} placeholder="Semua Jenis" tourId="filters-type" />
                    </div>

                    {Object.values(filters).some(v => v) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                            <button onClick={resetFilters} className="inline-flex items-center gap-x-2 px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-4.992-2.686h-4.992v.001M21.015 4.356v4.992m0 0h-4.992m0 0l-3.182-3.182a8.25 8.25 0 00-11.664 0L3.986 9.348" /></svg>
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-tour="bug-grid">
                    {bugs.length > 0 ? (
                        bugs.map((bug, idx) => (
                            <div key={bug.id} className="bg-white border border-slate-200 rounded-xl flex flex-col transition-all duration-300 hover:shadow-lg hover:border-indigo-400/50 hover:-translate-y-1">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-lg font-bold text-slate-800 pr-2">{bug.title}</h3>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap ${PRIORITY_CLASSES[bug.priority]}`}>{bug.priority}</span>
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-slate-100 text-slate-700">{bug.type}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-4 text-sm">
                                        <div className="flex items-center space-x-5"><span className="font-semibold text-slate-500">Status:</span><span className={`px-2 py-0.5 text-xs font-medium rounded-md ${STATUS_INFO[bug.status].class}`}>{STATUS_INFO[bug.status].text}</span></div>
                                        <div className="flex items-center gap-x-3"><span className="text-slate-600">Proyek: <span className="font-medium text-slate-800">{bug.project?.name ?? 'N/A'}</span></span></div>
                                        <div className="flex items-center gap-x-3"><span className="text-slate-600">Ditugaskan ke: <span className="font-medium text-slate-800">{bug.assignee?.name ?? 'Belum ada'}</span></span></div>
                                        <div className="flex items-center gap-x-3">
                                            <span className="text-slate-600">Jadwal: <span className="font-medium text-slate-800">{bug.schedule_start_at ? new Date(bug.schedule_start_at).toLocaleDateString() : '-'} → {bug.due_at ? new Date(bug.due_at).toLocaleDateString() : '-'}</span></span>
                                            {bug.due_at && ['open','in_progress'].includes(bug.status) && (new Date(bug.due_at).getTime() < Date.now()) && (<span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-700">Overdue</span>)}
                                        </div>
                                        {bug.resolution_duration_for_humans && <div className="flex items-center gap-x-3"><span className="text-slate-600">Durasi Penyelesaian: <span className="font-medium text-slate-800">{bug.resolution_duration_for_humans}</span></span></div>}
                                        {bug.attachments && bug.attachments.length > 0 && (
                                            <div className="pt-2">
                                                <span className="block text-sm font-semibold text-slate-700 mb-2">Lampiran:</span>
                                                <div className="flex gap-2 flex-wrap">
                                                    {bug.attachments.map((attachment, i) => (<button key={attachment.id} onClick={() => { if (isImageUrl(attachment.file_path)) setPreviewImage(attachment.file_path); else window.open(attachment.file_path, '_blank'); }} className="text-blue-600 underline text-sm hover:text-blue-800">{attachment.file_name}</button>))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-slate-50/75 border-t border-slate-200 px-6 py-3 flex justify-end items-center space-x-4 rounded-b-xl" data-tour={idx === 0 ? 'card-actions' : undefined}>
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

                <BugFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} isEditing={isEditing} form={form} projects={projects} users={users} />
            </div>

            {previewImage && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
                    <div className="bg-white p-2 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <img src={previewImage} alt="Preview" className="max-w-full h-auto rounded" />
                        <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 mt-4 px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700">&times;</button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
