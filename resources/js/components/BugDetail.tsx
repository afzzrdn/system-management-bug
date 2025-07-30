import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { Paperclip, X } from 'lucide-react';
import type { Bug } from '@/types/bug';

// Props untuk modal
interface BugDetailProps {
    bug: Bug | null;
    isOpen: boolean;
    onClose: () => void;
}

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

export default function BugDetail({ bug, isOpen, onClose }: BugDetailProps) {
    if (!bug) return null; // Jangan render apapun jika tidak ada bug yang dipilih

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{bug.title}</h1>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Proyek: <span className="font-semibold text-gray-700">{bug.project.name}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${priorityStyles[bug.priority]}`}>{bug.priority}</span>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusStyles[bug.status]}`}>{bug.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-700">
                                    <p>{bug.description}</p>
                                </div>
                                {bug.attachments && bug.attachments.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                            <Paperclip className="w-4 h-4" />Lampiran
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {bug.attachments.map(att => (
                                                <a key={att.id} href={`/storage/${att.file_path}`} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                                    <img src={`/storage/${att.file_path}`} alt={att.file_name} className="w-full h-24 object-cover" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}