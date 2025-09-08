import React, { useMemo, useState } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BugFormModal from '@/components/BugReportModal';
import BugDetail from '@/components/BugDetail';
import { Eye, Plus, Trash2, Filter, X, Search, ChevronDown } from 'lucide-react';
import type { Bug } from '@/types/bug';
import { useTour } from '@/tour/TourProvider'; // ⬅️ NEW

type Project = { id: number; name: string; };
type User = { id: number; name: string; role: 'developer' | 'client' | 'admin'; };
type PageProps = { bugs: Bug[]; projects: Project[]; users: User[]; };

export type BugFormData = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments: File[];
  project_id: string;
  assigned_to: string;
};

type StatusOpt = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';

export default function Bugs() {
  const { bugs = [], projects = [], users = [] } = usePage<PageProps>().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBug, setEditingBug] = useState<Bug | null>(null);
  const [detailBug, setDetailBug] = useState<Bug | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState<StatusOpt>('all');
  const [projectId, setProjectId] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const { start } = useTour(); // ⬅️ NEW

  const initialFormValues: BugFormData = { title: '', description: '', priority: 'low', status: 'open', attachments: [], project_id: '', assigned_to: '' };
  const { data, setData, post, processing, errors, reset, transform } = useForm(initialFormValues);
  const isEditing = editingBug !== null;

  const statusInfo = {
    open: { text: 'Open', class: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' },
    in_progress: { text: 'In Progress', class: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' },
    resolved: { text: 'Resolved', class: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' },
    closed: { text: 'Closed', class: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200' },
  } as const;

  const openAddModal = () => { setEditingBug(null); reset(); setIsModalOpen(true); };

  const closeModal = () => { setIsModalOpen(false); setEditingBug(null); reset(); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const onFinish = () => closeModal();
    transform(d => ({ ...d, description: d.description || '-', priority: d.priority || 'low', status: d.status || 'open', assigned_to: d.assigned_to || '', ...(isEditing ? { _method: 'put' } : {}) }));
    if (isEditing && editingBug) post(route('client.bugs.update', editingBug.id), { onSuccess: onFinish, forceFormData: true });
    else post(route('client.bugs.store'), { onSuccess: onFinish, forceFormData: true });
  };

  const handleDelete = (id: number) => { if (confirm('Yakin ingin menghapus bug ini?')) router.delete(route('bugs.destroy', id), { preserveScroll: true }); };

  const handleViewDetail = (bug: Bug) => { setDetailBug(bug); setIsDetailOpen(true); };

  const filteredBugs = useMemo(() => {
    return bugs.filter(b => {
      if (status !== 'all' && b.status !== status) return false;
      if (projectId && b.project?.id?.toString() !== projectId) return false;
      if (assigneeId && b.assignee?.id?.toString() !== assigneeId) return false;
      if (search) {
        const q = search.toLowerCase();
        const title = b.title?.toLowerCase() || '';
        const proj = b.project?.name?.toLowerCase() || '';
        if (!title.includes(q) && !proj.includes(q)) return false;
      }
      return true;
    });
  }, [bugs, status, projectId, assigneeId, search]);

  const resetFilter = () => { setStatus('all'); setProjectId(''); setAssigneeId(''); setSearch(''); };

  const runTour = () => {
    start(
      [
        { element: '[data-tour="add-bug"]',       popover: { title: 'Tambah Laporan Bug', description: 'Buat tiket baru. Bisa unggah gambar/video & pilih prioritas.' } },
        { element: '[data-tour="filter"]',        popover: { title: 'Filter', description: 'Saring berdasarkan status, project, assignee, atau cari judul.' } },
        { element: '[data-tour="filter-panel"]',  popover: { title: 'Cari & Status', description: 'Ketik kata kunci atau ubah status untuk mempersempit daftar.' } },
        { element: '[data-tour="bug-table"]',     popover: { title: 'Daftar Bug', description: 'Daftar tiket sesuai filter kamu.' } },
        { element: '[data-tour="row-view"]',      popover: { title: 'Detail Bug', description: 'Klik “Lihat” untuk membuka detail & diskusi.' } },
      ],
      { cursor: false, headerOffsetPx: 64 }
    );
  };

  return (
    <AppLayout>
      <Head><title>Manajemen Bug</title></Head>

      <div className="p-5 md:p-8 space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Manajemen Bug</h1>
          </div>
          <div className="relative">
            <div className="flex items-center gap-2">
              <button onClick={runTour} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50">
                Tutorial
              </button>

              <button data-tour="filter" onClick={() => setFilterOpen(v => !v)} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className={`h-4 w-4 transition ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              <button data-tour="add-bug" onClick={openAddModal} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <Plus className="h-4 w-4" />
                Tambah Laporan Bug
              </button>
            </div>

            {filterOpen && (
              <div data-tour="filter-panel" className="absolute right-0 z-20 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Cari</label>
                  <div className="relative">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul atau project..." className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-0 focus:border-indigo-300" />
                    <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as StatusOpt)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300">
                      <option value="all">Semua</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Project</label>
                    <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300">
                      <option value="">Semua</option>
                      {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Ditugaskan</label>
                  <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300">
                    <option value="">Semua</option>
                    {users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => { resetFilter(); }} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-gray-50">
                    <X className="h-4 w-4" />
                    Reset
                  </button>
                  <button onClick={() => setFilterOpen(false)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm" data-tour="bug-table">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white/80 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800">Daftar Bug</span>
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-gray-200">{filteredBugs.length} item</span>
            </div>
          </div>

          <div className="max-h-[640px] overflow-auto">
            <div className="md:hidden divide-y divide-gray-100">
              {filteredBugs.length > 0 ? (
                filteredBugs.map(bug => (
                  <div key={bug.id} className="p-4 hover:bg-gray-50/70 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900">{bug.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Project: {bug.project?.name ?? 'N/A'}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusInfo[bug.status].class}`}>{statusInfo[bug.status].text}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button onClick={() => handleViewDetail(bug)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-gray-50">
                        <Eye className="h-4 w-4" />
                        Lihat
                      </button>
                      <span className="ml-auto text-xs text-slate-600">{bug.assignee?.name ?? 'Belum ada'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">Tidak Ada Bug</h3>
                  <p className="mt-1 text-sm text-slate-500">Coba ubah filter atau tambah bug baru.</p>
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <div className="px-5 py-4">
                <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <table className="w-full table-fixed text-sm">
                    <colgroup>
                        <col className="w-[35%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                        <col className="w-[20%]" />
                    </colgroup>
                    <thead className="bg-gray-50 text-slate-600">
                        <tr className="text-xs uppercase tracking-wide">
                        <th className="px-5 py-3 text-left font-medium">Judul</th>
                        <th className="px-5 py-3 text-left font-medium">Project</th>
                        <th className="px-5 py-3 text-left font-medium">Ditugaskan ke</th>
                        <th className="px-5 py-3 text-left font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredBugs.map((bug, idx) => (
                        <tr key={bug.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4">{bug.title}</td>
                            <td className="px-5 py-4">{bug.project?.name ?? 'N/A'}</td>
                            <td className="px-5 py-4">
                                {bug.assignee?.name ? (
                                <span className="text-slate-800">{bug.assignee.name}</span>
                                ) : (
                                <span className="text-slate-400 italic">Belum ada</span>
                                )}
                            </td>
                            <td className="px-5 py-4">
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${statusInfo[bug.status].class}`}>
                                {statusInfo[bug.status].text}
                            </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                            <div className="inline-flex gap-2">
                                <button
                                data-tour={idx === 0 ? 'row-view' : undefined} // ⬅️ target step agar pasti ada
                                onClick={() => handleViewDetail(bug)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-gray-50"
                                >
                                <Eye className="h-4 w-4" />
                                Lihat
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BugFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} isEditing={isEditing} form={{ data, setData, errors, processing }} projects={projects} users={users} editingBug={editingBug} />

        {detailBug && <BugDetail bug={detailBug} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />}
      </div>
    </AppLayout>
  );
}
