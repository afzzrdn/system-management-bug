import React, { useState, useMemo } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Search, ClipboardList, Loader, CheckCircle } from 'lucide-react';
import BugDetail from '@/components/BugDetail';
import type { Bug } from '@/types/bug';

type PageProps = {
    bugs?: Bug[];
    stats?: {
        assigned: number;
        in_progress: number;
        resolved: number;
    }
};

const priorityStyles = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
};

const statusStyles = {
    open: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-500 text-white',
};

type StatusFilter = 'all' | 'open' | 'in_progress' | 'resolved';

export default function DeveloperBugsPage() {
    const { bugs: bugsFromProps, stats: statsFromProps } = usePage<PageProps>().props;
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
    const [loadingDetail, setLoadingDetail] = useState(false);

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

    const bugs = bugsFromProps || [];
    const stats = statsFromProps || { assigned: 0, in_progress: 0, resolved: 0 };

    const filteredBugs = useMemo(() => {
        if (selectedStatus === 'all') {
            return bugs;
        }
        return bugs.filter(bug => bug.status === selectedStatus);
    }, [bugs, selectedStatus]);

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
                <h1 className="text-2xl font-semibold text-gray-400 ">Management Bug</h1>
            </div>
            <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-500">Baru Ditugaskan</h3>
                            <p className="text-3xl font-bold mt-2">{stats.assigned}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <ClipboardList className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-500">Sedang Dikerjakan</h3>
                            <p className="text-3xl font-bold mt-2">{stats.in_progress}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Loader className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-400 flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-500">Selesai</h3>
                            <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-400">
                    <div className="p-4 flex flex-wrap justify-between items-center border-b gap-4">
                        <div className="flex items-center gap-2">
                            {filterButtons.map(btn => (
                                <button
                                    key={btn.value}
                                    onClick={() => setSelectedStatus(btn.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                                        selectedStatus === btn.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Cari bug..." className="pl-9 pr-3 py-2 border rounded-lg text-sm w-full md:w-48" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-600">Judul</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Proyek</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Prioritas</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-left font-semibold text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBugs.length > 0 ? filteredBugs.map(bug => (
                                    <tr key={bug.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{bug.title}</div>
                                            <div className="text-xs text-gray-500">Dilaporkan oleh {bug.reporter.name}</div>
                                        </td>
                                        <td className="p-4 text-gray-700">{bug.project.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityStyles[bug.priority]}`}>{bug.priority}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[bug.status]}`}>{bug.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => openDetailModal(bug.id)} className="text-indigo-600 hover:underline font-semibold">
                                            Lihat Detail
                                        </button>

                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-gray-500">Tidak ada bug yang cocok dengan filter ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <BugDetail
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                bug={selectedBug}
            />
        </AppLayout>
    );
}
