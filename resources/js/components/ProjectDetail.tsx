import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

type ProjectDetailModalProps = {
    project: {
        id: number;
        name: string;
        description: string | null;
        client?: { id: number; name: string };
    };
    onClose: () => void;
};

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const activities = [
    {
        date: "21-7-2025",
        version: "v1.0.0",
        title: "Perbaikan Bug & Rilis Awal",
        description: "Versi pertama dirilis ke klien untuk UAT. Beberapa bug minor pada modul login telah diperbaiki.",
        status: "completed"
    },
    {
        date: "15-7-2025",
        version: "v0.9.0",
        title: "Penyelesaian Fase Development",
        description: "Semua fitur utama telah selesai dikembangkan dan diintegrasikan. Siap untuk pengujian internal.",
        status: "completed"
    },
    {
        date: "01-7-2025",
        version: "v0.5.0",
        title: "Desain UI/UX Disetujui",
        description: "Mockup dan prototipe final telah disetujui oleh klien. Pengembangan antarmuka dimulai.",
        status: "completed"
    },
    {
        date: "20-6-2025",
        version: "v0.1.0",
        title: "Project Kick-off",
        description: "Rapat awal dengan klien untuk menentukan ruang lingkup, tujuan, dan timeline proyek.",
        status: "milestone"
    },
];


const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
    return (
        <Transition appear show={!!project} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-sm font-medium text-gray-500"
                                >
                                    Project /
                                    <span className='text-blue-600 font-semibold'> Project Detail</span>
                                </Dialog.Title>
                                <div className="mt-4 flex items-center gap-5 border-b border-gray-200 pb-5">
                                    <div className='flex-shrink-0 bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center'>
                                        {/* Placeholder for a project logo or icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                    </div>
                                    <div className='flex-grow'>
                                        <p className='font-bold text-2xl text-gray-800'>{project.name}</p>
                                        <p className='text-sm text-gray-500'>{project.client?.name || 'N/A'}</p>
                                        <p className='bg-green-100 text-green-800 mt-2 rounded-full inline-block text-xs font-semibold px-3 py-1'>Diproses</p>
                                    </div>
                                </div>

                                <div className='mt-5 flex flex-col lg:flex-row gap-6'>
                                    {/* --- General Information (Left Column) --- */}
                                    <div className='border border-gray-200 rounded-xl p-5 lg:w-1/3'>
                                        <h2 className='font-semibold text-lg text-gray-800 mb-4'>General Information</h2>
                                        <div className='space-y-4'>
                                            <div className="flex items-start gap-3">
                                                <InfoIcon />
                                                <div>
                                                    <p className="text-xs text-gray-500">Client</p>
                                                    <p className="text-sm font-medium text-gray-800">{project.client?.name || 'Internal Project'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon />
                                                <div>
                                                    <p className="text-xs text-gray-500">Tanggal Mulai</p>
                                                    <p className="text-sm font-medium text-gray-800">20 Juni 2025</p>
                                                </div>
                                            </div>
                                             <div className="flex items-start gap-3">
                                                <CalendarIcon />
                                                <div>
                                                    <p className="text-xs text-gray-500">Estimasi Selesai</p>
                                                    <p className="text-sm font-medium text-gray-800">20 Agustus 2025</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <TeamIcon />
                                                <div>
                                                    <p className="text-xs text-gray-500">Project Manager</p>
                                                    <p className="text-sm font-medium text-gray-800">Andi Budiman</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Details (Right Column) --- */}
                                    <div className='lg:w-2/3 space-y-6'>
                                        <div className='border border-gray-200 rounded-xl p-5'>
                                            <h2 className='font-semibold text-lg text-gray-800'>Deskripsi</h2>
                                            <p className='pt-3 text-sm text-gray-600 leading-relaxed'>{project.description || 'Tidak ada deskripsi untuk proyek ini.'}</p>
                                        </div>
                                        <div className='border border-gray-200 rounded-xl p-5'>
                                            <h2 className='font-semibold text-lg text-gray-800'>Aktifitas</h2>
                                            <div className="mt-4 flow-root">
                                                <div className="-mb-8">
                                                    {activities.map((activity, activityIdx) => (
                                                        <div key={activity.title} className="relative pb-8">
                                                            {activityIdx !== activities.length - 1 ? (
                                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                            ) : null}
                                                            <div className="relative flex items-start space-x-4">
                                                                <div>
                                                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div>
                                                                        <div className="flex justify-between items-center">
                                                                            <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                                                                            <p className="text-xs text-gray-400">{activity.date}</p>
                                                                        </div>
                                                                        <p className="mt-0.5 text-sm text-gray-500">{activity.description}</p>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <p className='border w-fit text-center rounded-md py-0.5 px-2 border-gray-300 text-xs text-gray-600'>{activity.version}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors"
                                    >
                                        Tutup
                                    </button>
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