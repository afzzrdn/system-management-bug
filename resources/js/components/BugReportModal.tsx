import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import type { BugFormData } from '@/pages/client/bug';

// --- TYPE DEFINITIONS ---
type Project = { id: number; name: string; };
type User = { id: number; name: string; role: 'developer' | 'client' | 'admin'; };
type Attachment = { id: number; file_path: string; file_name: string; };
type Bug = { attachments?: Attachment[] };

interface BugFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isEditing: boolean;
    form: { data: BugFormData; setData: (field: keyof BugFormData, value: any) => void; errors: Partial<Record<keyof BugFormData, string>>; processing: boolean; };
    projects: Project[];
    users: User[];
    editingBug: Bug | null;
}

export default function BugFormModal({ isOpen, onClose, onSubmit, isEditing, form, projects, users, editingBug }: BugFormModalProps) {
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    useEffect(() => {
        if (!form.data.attachments || form.data.attachments.length === 0) {
            setImagePreview([]);
            return;
        }
        const newPreviews: string[] = [];
        Array.from(form.data.attachments).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === form.data.attachments.length) {
                    setImagePreview(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [form.data.attachments]);

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
                                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-6">{isEditing ? 'Edit Laporan Bug' : 'Buat Laporan Bug Baru'}</Dialog.Title>
                                <form onSubmit={onSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Project</label>
                                            <select value={form.data.project_id} onChange={e => form.setData('project_id', e.target.value)} className="mt-2 p-3 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                                <option value="">Pilih Project</option>
                                                {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                                            </select>
                                            {form.errors.project_id && <p className="text-red-500 text-xs mt-1">{form.errors.project_id}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi Masalah</label>
                                            <textarea
                                                name="title"
                                                value={form.data.title}
                                                onChange={e => form.setData('title', e.target.value)}
                                                rows={5}
                                                required
                                                className="mt-2 p-3 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            {form.errors.title && <p className="text-red-500 text-xs mt-1">{form.errors.title}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Detail Bug</label>
                                            <textarea
                                                name="description"
                                                value={form.data.description}
                                                onChange={e => form.setData('description', e.target.value)}
                                                rows={4}
                                                className="mt-2 p-3 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {form.errors.description && <p className="text-red-500 text-xs mt-1">{form.errors.description}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Upload Screenshot (opsional)</label>
                                            <div className="mt-2 flex items-center">
                                                <label htmlFor="attachments" className="text-sm inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg cursor-pointer transition-colors">Choose Files</label>
                                                <span className="ml-3 text-gray-500 text-sm">{form.data.attachments ? `${form.data.attachments.length} file dipilih` : 'No files chosen'}</span>
                                            </div>
                                            <input id="attachments" type="file" multiple accept="image/*" onChange={e => form.setData('attachments', e.target.files ? Array.from(e.target.files) : [])} className="hidden" />
                                            {form.errors.attachments && <p className="text-red-500 text-xs mt-1">{form.errors.attachments}</p>}
                                            {isEditing && editingBug?.attachments && editingBug.attachments.length > 0 && <div className="mt-4"><p className="text-sm font-medium text-gray-600 mb-2">Lampiran Saat Ini:</p><div className="flex flex-wrap gap-3">{editingBug.attachments.map(att => (<a key={att.id} href={att.file_path} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">{att.file_name}</a>))}</div></div>}
                                            {imagePreview.length > 0 && <div className="mt-4"><p className="text-sm font-medium text-gray-600 mb-2">Preview Tambahan:</p><div className="flex flex-wrap gap-3">{imagePreview.map((src, idx) => (<img key={idx} src={src} alt="Preview" className="w-24 h-24 object-cover rounded-md border p-1" />))}</div></div>}
                                        </div>
                                    </div>
                                    <div className="pt-5 flex justify-end gap-3">
                                        <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors">Batal</button>
                                        <button type="submit" disabled={form.processing} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 transition-colors">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                                    </div>
                                 </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
