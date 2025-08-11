import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Search, ClipboardList, Loader, CheckCircle, Eye } from 'lucide-react';
import BugDetail from '@/components/BugDetail';
import type { Bug } from '@/types/bug';

type PageProps = {
  bugs?: Bug[];
  stats?: { assigned: number; in_progress: number; resolved: number };
};

type StatusFilter = 'all' | 'open' | 'in_progress' | 'resolved';

const priorityStyles = {
  low: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  medium: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100',
  high: 'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
  critical: 'bg-red-50 text-red-700 ring-1 ring-red-100',
} as const;

const statusStyles = {
  open: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  closed: 'bg-gray-600 text-white',
} as const;

export default function DeveloperBugsPage() {
  const { bugs: bugsFromProps, stats: statsFromProps } = usePage<PageProps>().props;
  const bugs = bugsFromProps ?? [];
  const stats = statsFromProps ?? { assigned: 0, in_progress: 0, resolved: 0 };
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [q, setQ] = useState('');

  const openDetailModal = async (bugId: number) => {
    setLoadingDetail(true);
    try {
      const { data } = await axios.get(`/developer/bugs/${bugId}`);
      setSelectedBug(data.bug);
      setIsDetailModalOpen(true);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedBug(null);
  };

  const filteredBugs = useMemo(() => {
    let list = bugs;
    if (selectedStatus !== 'all') list = list.filter(b => b.status === selectedStatus);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(b => (b.title || '').toLowerCase().includes(s) || (b.project?.name || '').toLowerCase().includes(s));
    }
    return list;
  }, [bugs, selectedStatus, q]);

  const filterButtons: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
  ];

  return (
    <AppLayout>
      <Head title="Bug" />
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-400 mb-6">Management Bug</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-500">Baru Ditugaskan</h3>
              <p className="text-3xl font-bold mt-2">{stats.assigned}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <ClipboardList className="w-7 h-7 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-500">Sedang Dikerjakan</h3>
              <p className="text-3xl font-bold mt-2">{stats.in_progress}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Loader className="w-7 h-7 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-500">Selesai</h3>
              <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              {filterButtons.map(btn => (
                <button
                  key={btn.value}
                  onClick={() => setSelectedStatus(btn.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${selectedStatus === btn.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari bug..." className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm w-64 outline-none focus:border-indigo-300" />
            </div>
          </div>

          <div className="max-h-[640px] overflow-auto">
            <div className="md:hidden divide-y divide-gray-100">
              {filteredBugs.length ? (
                filteredBugs.map(bug => (
                  <div key={bug.id} className="p-4 hover:bg-gray-50/70 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900">{bug.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Project: {bug.project?.name ?? 'N/A'}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Prioritas: {bug.priority}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusStyles[bug.status as keyof typeof statusStyles]}`}>
                        {bug.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-3">
                      <button onClick={() => openDetailModal(bug.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-gray-50">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">Tidak Ada Bug</h3>
                  <p className="mt-1 text-sm text-slate-500">Ubah filter atau kata kunci pencarian.</p>
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <div className="px-5 py-4">
                <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <table className="w-full table-fixed text-sm">
                    <colgroup>
                      <col className="w-[40%]" />
                      <col className="w-[22%]" />
                      <col className="w-[14%]" />
                      <col className="w-[14%]" />
                      <col className="w-[10%]" />
                    </colgroup>
                    <thead className="bg-gray-50 text-slate-600">
                      <tr className="text-xs uppercase tracking-wide">
                        <th className="px-5 py-3 text-left font-medium">Judul</th>
                        <th className="px-5 py-3 text-left font-medium">Proyek</th>
                        <th className="px-5 py-3 text-left font-medium">Prioritas</th>
                        <th className="px-5 py-3 text-left font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBugs.length ? (
                        filteredBugs.map(bug => (
                          <tr key={bug.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 align-middle">
                              <div className="min-w-0">
                                <p className="truncate text-[15px] font-semibold text-slate-900 leading-6">{bug.title}</p>
                                <p className="mt-0.5 truncate text-xs text-slate-500">Dilaporkan oleh {bug.reporter?.name ?? '-'}</p>
                              </div>
                            </td>
                            <td className="px-5 py-4 align-middle whitespace-nowrap text-slate-700">{bug.project?.name ?? 'N/A'}</td>
                            <td className="px-5 py-4 align-middle">
                              <span className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${priorityStyles[bug.priority as keyof typeof priorityStyles]}`}>{bug.priority}</span>
                            </td>
                            <td className="px-5 py-4 align-middle">
                              <span className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${statusStyles[bug.status as keyof typeof statusStyles]}`}>{bug.status.replace('_', ' ')}</span>
                            </td>
                            <td className="px-5 py-4 text-right">
                            <div className="inline-flex gap-2">
                                <button
                                onClick={() => openDetailModal(bug.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-gray-50"
                                >
                                <Eye className="h-4 w-4" />
                                Lihat
                                </button>
                            </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-16 text-center">
                            <div className="mx-auto max-w-md">
                              <h3 className="text-lg font-semibold text-slate-900">Tidak Ada Bug</h3>
                              <p className="mt-1 text-sm text-slate-500">Ubah filter atau kata kunci pencarian.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BugDetail isOpen={isDetailModalOpen} onClose={closeDetailModal} bug={selectedBug} />
    </AppLayout>
  );
}
