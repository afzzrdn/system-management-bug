import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import type { Bug } from '@/types/bug';
import type { Project } from '@/types/project';

type ProjectDetailModalProps = {
    project: {
        id: number;
        name: string;
        description: string | null;
        client?: { id: number; name: string };
        bugs?: Bug[];
    };
    onClose: () => void;
};

type ProjectStatus = { text: string; color: string };

const statusStyles = {
    open: 'border-gray-300 bg-gray-50 text-gray-700',
    in_progress: 'border-blue-300 bg-blue-50 text-blue-700',
    resolved: 'border-green-300 bg-green-50 text-green-700',
    closed: 'border-gray-400 bg-gray-100 text-gray-600',
};

const getProjectStatus = (bugs: Bug[] | undefined): ProjectStatus => {
    if (!bugs || bugs.length === 0) return { text: 'Belum Ada Laporan', color: 'bg-gray-400' };
    const statuses = bugs.map(b => b.status);
    if (statuses.includes('in_progress')) return { text: 'Sedang Diproses', color: 'bg-blue-500' };
    if (statuses.every(s => s === 'closed')) return { text: 'Laporan Ditutup', color: 'bg-gray-700' };
    if (statuses.every(s => s === 'resolved')) return { text: 'Sudah Ditinjau', color: 'bg-green-500' };
    if (statuses.every(s => s === 'open')) return { text: 'Menunggu Tinjauan', color: 'bg-yellow-500' };
    return { text: 'Sedang Diproses', color: 'bg-blue-500' };
};

// Fungsi getVersion yang lebih sederhana dan akurat
const getVersion = (index: number, total: number) => {
    const reversedIndex = total - 1 - index;
    const major = 1 + Math.floor(reversedIndex / 10);
    const minor = reversedIndex % 10;
    return `${major}.${minor}`;
};

const renderTimelineInfo = (bug: Bug) => {
    switch (bug.status) {
        case 'resolved':
            return `Durasi: ${bug.resolution_duration_for_humans || 'Selesai'}`;
        case 'in_progress':
            return `Estimasi: ${bug.due_at ? new Date(bug.due_at).toLocaleString('id-ID') : '-'}`;
        default:
            return 'Waiting';
    }
};

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
    const relevantBugs = project.bugs?.filter(bug => bug.status !== 'open');
    const { text: projectStatus, color: statusColor } = getProjectStatus(relevantBugs);

    return (
        <Transition appear show={!!project} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/60" /></Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="min-w-[80vw] max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-sm text-gray-900">Project / <span className='text-blue-700'> Project Detail</span></Dialog.Title>
                                <div className="mt-4 space-y-3 flex gap-5">
                                    <div>
                                        <p className='font-semibold text-xl'>{project.name}</p>
                                        <p className='text-sm text-gray-500'>{project.client?.name || 'N/A'}</p>
                                        <p className={`${statusColor} mt-3 rounded-xl max-w-[130px] text-center text-xs text-white py-1`}>{projectStatus}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col lg:flex-row gap-3 mt-6'>
                                    <div className='border border-gray-300 rounded-xl p-3 lg:w-1/3'>
                                        <h2 className='font-semibold'>General Information</h2>
                                        <p className='pt-5 text-xs'>{project.description || '-'}</p>
                                    </div>
                                    <div className='border border-gray-300 rounded-xl p-3 lg:w-2/3'>
                                        <h2 className='font-semibold'>Aktifitas (Bug)</h2>
                                        <div className="mt-5 space-y-8 relative max-h-[60vh] overflow-y-auto pr-3">
                                            {relevantBugs && relevantBugs.length > 0 ? (
                                                relevantBugs.map((bug: Bug, index: number) => (
                                                    <div key={bug.id} className="flex space-x-5 relative">
                                                        <div className='text-xs space-y-1 w-24 flex-shrink-0'>
                                                            <p>{new Date(bug.created_at).toLocaleDateString('id-ID')}</p>
                                                            <p className='border w-[70px] text-center rounded-xl py-1 border-gray-300 text-[10px] capitalize'>{getVersion(index, relevantBugs.length)}</p>
                                                            <p className={`border w-[70px] text-center rounded-xl py-1 text-[10px] font-medium capitalize ${statusStyles[bug.status as keyof typeof statusStyles]}`}>{String(bug.status).replace('_', ' ')}</p>
                                                            <p className='text-[10px] text-gray-600'>{renderTimelineInfo(bug)}</p>
                                                        </div>
                                                        <div className='w-[1px] absolute left-[90px] top-0 bottom-0 bg-gray-300 -z-10'></div>
                                                        <div className="pl-4">
                                                            <h2 className='text-sm font-bold'>{bug.title}</h2>
                                                            <div className="flex flex-wrap gap-3 mt-3">
                                                                {(bug.attachments ?? []).map((att: any) => (
                                                                    <a href={att.file_url} target="_blank" rel="noopener noreferrer" key={att.id}>
                                                                        <img src={att.file_url} alt="Screenshot" className="w-40 h-24 rounded-lg border object-cover hover:ring-2 hover:ring-blue-500 transition-all" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (<p className="text-sm text-gray-500">Belum ada aktivitas bug pada project ini.</p>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Tutup</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ProjectDetailModal;
