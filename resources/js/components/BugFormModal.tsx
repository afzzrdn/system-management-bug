import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

// --- Helper Komponen untuk Ikon Centang ---
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);


type Project = { id: number; name: string };
type User = { id: number; name: string };

type BugFormData = {
  title: string;
  description: string;
  attachment: File | string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  project_id: string | number;
  reported_by: string | number;
  assigned_to: string | number;
  resolved_at: string | null;
};

// Menambahkan tipe untuk error di frontend
type FrontEndErrors = Partial<Record<'title' | 'description' | 'project_id', string>>;

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

  const [step, setStep] = useState(1);
  const [frontEndErrors, setFrontEndErrors] = useState<FrontEndErrors>({});

  if (!form) {
    return null;
  }

  const handleClose = () => {
    setStep(1);
    setFrontEndErrors({}); 
    onClose();
  };
 2
  const handleNextStep = () => {
    const errors: FrontEndErrors = {};
    if (!form.data.title.trim()) errors.title = 'Judul wajib diisi.';
    if (!form.data.description.trim()) errors.description = 'Deskripsi wajib diisi.';
    if (!form.data.project_id) errors.project_id = 'Proyek wajib dipilih.';

    setFrontEndErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep(2);
    }
  };
  
  // Fungsi untuk update data sekaligus membersihkan error frontend
  const setDataAndClearError = (field: keyof BugFormData, value: any) => {
    form.setData(field, value);
    if (frontEndErrors[field as keyof FrontEndErrors]) {
      setFrontEndErrors(prev => ({...prev, [field]: undefined }));
    }
  }

  const renderAttachmentInfo = () => {
    if (!form.data.attachment) return null;
    return (
      <div className="mt-3 text-sm text-gray-700 flex items-center justify-between bg-gray-100 p-2 rounded-md">
        <span className="truncate">
          {form.data.attachment instanceof File
            ? form.data.attachment.name
            : <a href={form.data.attachment} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Lihat attachment saat ini</a>
          }
        </span>
        <button
          type="button"
          onClick={() => form.setData('attachment', null)}
          className="ml-4 flex-shrink-0 text-red-500 hover:text-red-700 font-semibold text-xs"
        >
          Hapus
        </button>
      </div>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                
                <div className="w-full max-w-md mx-auto mb-8">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                      {step > 1 ? <CheckIcon /> : '1'}
                    </div>
                    <p className={`ml-2 font-semibold text-sm transition-colors duration-300 ${step >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>Detail Bug</p>
                    <div className={`flex-auto text-sm border-t-2 mx-4 transition-colors duration-300 ${step > 1 ? 'border-indigo-600' : 'border-gray-300'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors durati text-sm on-300 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}>2</div>
                    <p className={`ml-2 text-sm font-semibold transition-colors duration-300 ${step >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>Lampiran</p>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Judul</label>
                        <input type="text" value={form.data.title} onChange={e => setDataAndClearError('title', e.target.value)} className="mt-2 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" />
                        { (frontEndErrors.title || form.errors.title) && <p className="text-red-500 text-xs mt-1">{frontEndErrors.title || form.errors.title}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea value={form.data.description} onChange={e => setDataAndClearError('description', e.target.value)} rows={4} className="mt-2 block p-3 w-full border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" />
                        { (frontEndErrors.description || form.errors.description) && <p className="text-red-500 text-xs mt-1">{frontEndErrors.description || form.errors.description}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                          <select value={form.data.priority} onChange={e => form.setData('priority', e.target.value as BugFormData['priority'])} className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select value={form.data.status} onChange={e => form.setData('status', e.target.value as BugFormData['status'])} className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm"><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Proyek</label>
                          <select value={form.data.project_id} onChange={e => setDataAndClearError('project_id', e.target.value)} className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm"><option value="">Pilih Proyek</option>{projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select>
                          { (frontEndErrors.project_id || form.errors.project_id) && <p className="text-red-500 text-xs mt-1">{frontEndErrors.project_id || form.errors.project_id}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dilaporkan oleh</label>
                          <select value={form.data.reported_by} onChange={e => form.setData('reported_by', e.target.value)} className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm"><option value="">Pilih User</option>{users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}</select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Ditugaskan ke</label>
                          <select value={form.data.assigned_to} onChange={e => form.setData('assigned_to', e.target.value)} className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm"><option value="">Pilih User</option>{users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}</select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tgl. Selesai</label>
                          <input type="date" value={form.data.resolved_at || ''} onChange={e => form.setData('resolved_at', e.target.value)} className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="min-h-[450px] flex flex-col justify-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lampiran (Opsional)</label>
                      <div className="flex flex-grow flex-col justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                              <label htmlFor="attachment-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                  <span>Upload sebuah file</span>
                                  <input id="attachment-upload" name="attachment" type="file" className="sr-only"  onChange={e => form.setData('attachment', e.target.files ? e.target.files[0] : null)}/>
                              </label>
                              <p className="pl-1">atau seret dan lepas</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF, PDF hingga 10MB</p>
                        </div>
                      </div>
                      {renderAttachmentInfo()}
                      {form.errors.attachment && <p className="text-red-500 text-xs mt-1">{form.errors.attachment}</p>}
                    </div>
                  )}
                  
                  <div className="pt-5 flex justify-end gap-3 text-sm">
                    {step === 1 && (
                      <>
                        <button type="button" onClick={handleClose} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Batal</button>
                        {/* 3. Tombol Lanjutkan sekarang memanggil fungsi validasi */}
                        <button type="button" onClick={handleNextStep} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">Lanjutkan</button>
                      </>
                    )}
                    {step === 2 && (
                       <>
                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Kembali</button>
                        <button type="submit" disabled={form.processing} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                      </>
                    )}
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