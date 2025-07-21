import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Client = {
    id: number;
    name: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  processing: boolean;
  data: {
    name: string;
    description: string;
    client_id: string;
  };
  setData: (field: string, value: any) => void;
  errors?: Record<string, string>;
  clients: Client[];
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  processing,
  data,
  setData,
  errors = {},
  clients,
}: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {isEditing ? 'Edit Project' : 'Tambah Project Baru'}
                </Dialog.Title>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Project</label>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                      id="description"
                      rows={3}
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
                    <select
                      id="client"
                      value={data.client_id}
                      onChange={(e) => setData('client_id', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                    >
                      <option value="">-- Pilih Client --</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                    {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
                  </div>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processing ? 'Menyimpan...' : isEditing ? 'Perbarui Project' : 'Simpan'}
                    </button>
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
