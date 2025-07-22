import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Project = { id: number; name:string; };
type User = { id: number; name: string; };

type BugFormData = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  project_id: string | number;
  reported_by: string | number;
  assigned_to: string | number;
  resolved_at: string | null;
};

interface BugFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  form?: {
    data: BugFormData;
    setData: (field: keyof BugFormData, value: any) => void;
    errors: Partial<Record<keyof BugFormData, string>>;
    processing: boolean;
  };
  projects: Project[];
  users: User[];
}

export default function BugFormModal({ isOpen, onClose, onSubmit, isEditing, form, projects, users }: BugFormModalProps) {

  if (!form) {
    return null;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl min-h-[95vh] transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl text-center font-bold leading-8 text-gray-900 mb-5">{isEditing ? 'Edit Bug' : 'Tambah Bug Baru'}</Dialog.Title>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium text-gray-700">Judul</label>
                    <input type="text" value={form.data.title} onChange={e => form.setData('title', e.target.value)} className="mt-3 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    {form.errors.title && <p className="text-red-500 text-xs mt-1">{form.errors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">Deskripsi</label>
                    <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} rows={4} className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Prioritas</label>
                      <select value={form.data.priority} onChange={e => form.setData('priority', e.target.value as BugFormData['priority'])} className="mt-3 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Status</label>
                      <select value={form.data.status} onChange={e => form.setData('status', e.target.value as BugFormData['status'])} className="mt-3 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Proyek</label>
                      <select value={form.data.project_id} onChange={e => form.setData('project_id', e.target.value)} className="mt-3 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"><option value="">Pilih Proyek</option>{projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select>
                      {form.errors.project_id && <p className="text-red-500 text-xs mt-1">{form.errors.project_id}</p>}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Dilaporkan oleh</label>
                      <select value={form.data.reported_by} onChange={e => form.setData('reported_by', e.target.value)} className="mt-3 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"><option value="">Pilih User</option>{users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}</select>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Ditugaskan ke</label>
                      <select value={form.data.assigned_to} onChange={e => form.setData('assigned_to', e.target.value)} className="mt-3 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"><option value="">Pilih User</option>{users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}</select>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">Tgl. Selesai</label>
                      <input type="date" value={form.data.resolved_at || ''} onChange={e => form.setData('resolved_at', e.target.value)} className="mt-3 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 mt-3 py-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Batal</button>
                    <button type="submit" disabled={form.processing} className="px-6 mt-3 py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
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
