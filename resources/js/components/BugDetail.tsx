import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Paperclip, X } from 'lucide-react';
import type { Bug } from '@/types/bug';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import AttachmentUploader from '@/components/AttachmentUploader';

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
} as const;

const statusStyles = {
  open: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-500 text-white',
} as const;

export default function BugDetail({ bug, isOpen, onClose }: BugDetailProps) {
  const { auth } = usePage().props as any;
  const isDeveloper = auth?.user?.role === 'developer';
  const [showAttach, setShowAttach] = useState(false);
  const [attachments, setAttachments] = useState<any[]>(bug?.attachments ?? []);

  useEffect(() => {
    setAttachments(bug?.attachments ?? []);
  }, [bug]);

  if (!bug) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Tutup"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      {bug.title}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-500">
                      Proyek:{' '}
                      <span className="font-semibold text-gray-700">
                        {bug.project?.name ?? '-'}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Dilaporkan oleh:{' '}
                      <span className="font-medium">
                        {bug.reporter?.name ?? '-'}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold capitalize ${
                        priorityStyles[bug.priority as keyof typeof priorityStyles]
                      }`}
                    >
                      {bug.priority}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold capitalize ${
                        statusStyles[bug.status as keyof typeof statusStyles]
                      }`}
                    >
                      {bug.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{bug.description}</p>
                </div>

                {/* Lampiran (preview read-only yang sudah ada di bug) */}
                {Array.isArray(attachments) && attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 flex items-center gap-2 border-b pb-2 text-base font-semibold text-gray-800">
                      <Paperclip className="h-4 w-4" />
                      Lampiran
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {attachments.map((att: any) => (
                        <Zoom key={att.id}>
                          <img
                            src={`/storage/${att.file_path}`}
                            alt={att.file_name}
                            className="h-24 w-full cursor-zoom-in rounded-lg border object-cover"
                            loading="lazy"
                          />
                        </Zoom>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aksi khusus developer */}
                {isDeveloper && (
                  <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                    <button
                      onClick={() => setShowAttach((v) => !v)}
                      className="rounded border border-gray-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50"
                      type="button"
                    >
                      {showAttach ? 'Tutup Lampiran' : 'Kelola Lampiran'}
                    </button>
                  </div>
                )}

                {/* Panel uploader lampiran (developer) */}
                {isDeveloper && showAttach && (
                  <div className="mt-4">
                    <AttachmentUploader
                      bugId={bug.id}
                      initial={attachments as any[]}
                      onChanged={setAttachments}
                    />
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
