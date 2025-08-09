import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Paperclip, X, Save } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import type { Bug } from '@/types/bug';

interface BugDetailProps {
    bug: Bug | null;
    isOpen: boolean;
    onClose: () => void;
}

const priorityStyles = { low: 'bg-blue-100 text-blue-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-orange-100 text-orange-800', critical: 'bg-red-100 text-red-800' };
const statusStyles = { open: 'bg-gray-100 text-gray-800', in_progress: 'bg-purple-100 text-purple-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-500 text-white' };

export default function BugDetail({ bug, isOpen, onClose }: BugDetailProps) {
    const { auth } = usePage().props as any;
    const [currentStatus, setCurrentStatus] = useState(bug?.status || 'open');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (bug) {
            setCurrentStatus(bug.status);
        }
    }, [bug]);

    const handleStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bug) return;
        setIsProcessing(true);
        router.put(route('developer.bugs.update', { bug: bug.id }), { status: currentStatus }, {
            onSuccess: () => {
                onClose();
                router.reload({ only: ['bugs', 'stats'] });
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    if (!bug) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/60" /></Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{bug.title}</h1>
                                        <p className="text-sm text-gray-500 mt-2">Proyek: <span className="font-semibold text-gray-700">{bug.project.name}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${priorityStyles[bug.priority]}`}>{bug.priority}</span>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStyles[bug.status]}`}>{bug.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-700"><p>{bug.description}</p></div>
                                {bug.attachments && bug.attachments.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><Paperclip className="w-4 h-4" />Lampiran</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {bug.attachments.map(att => (
                                                <Zoom key={att.id}>
                                                    <img
                                                    src={`/storage/${att.file_path}`}
                                                    alt={att.file_name}
                                                    className="w-full h-24 object-cover cursor-zoom-in rounded-lg border"
                                                    />
                                                </Zoom>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {auth.user.role === 'developer' && (
                                    <form onSubmit={handleStatusUpdate} className="mt-8 border-t pt-6">
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Perbarui Status Bug</label>
                                        <div className="flex items-center gap-4">
                                            <select
                                                id="status"
                                                value={currentStatus}
                                                onChange={(e) => setCurrentStatus(e.target.value as Bug['status'])}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <button type="submit" disabled={isProcessing} className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                                                <Save className="w-4 h-4 mr-2" />
                                                {isProcessing ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
