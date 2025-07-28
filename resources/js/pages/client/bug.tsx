import React, { useEffect, useState } from 'react';
import { usePage, Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type BugFormData = {
  title: string;
  project_id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  attachments: File[] | null;
};

type Project = {
  id: number;
  name: string;
};

type PageProps = {
  auth: { user: { name: string } };
  projects: Project[];
};

export default function LaporBug() {
  const { auth, projects } = usePage<PageProps>().props;

  const { data, setData, post, processing, errors, reset } = useForm<BugFormData>({
    title: '',
    project_id: '',
    priority: 'low',
    description: '',
    attachments: null,
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Preview gambar
  useEffect(() => {
    if (data.attachments && data.attachments.length > 0) {
      const previews: string[] = [];
      Array.from(data.attachments).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === data.attachments!.length) {
            setImagePreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setImagePreview([]);
    }
  }, [data.attachments]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('client.bugs.store'), {
      onSuccess: () => {
        reset();
        setImagePreview([]);
      },
    });
  };

  return (
    <AppLayout>
      <Head>
        <title>Lapor Bug</title>
      </Head>
      <div className="py-12 bg-gray-50 rounded-xl shadow-lg">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white p-7 rounded-xl shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800">Bug Service Ticket</h3>
              <p className="text-gray-600 mt-2">Silakan isi detail bug yang Anda temukan.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Bug</label>
                  <input type="text" placeholder="Masukkan judul bug" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select value={data.project_id} onChange={e => setData('project_id', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="">Pilih Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.project_id && <p className="text-red-500 text-sm mt-1">{errors.project_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
                  <select value={data.priority} onChange={e => setData('priority', e.target.value as any)} className="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot (opsional)</label>
                <div className="flex items-center">
                  <label htmlFor="attachments" className="text-sm inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg cursor-pointer transition-colors">Choose Files</label>
                  <span className="ml-3 text-gray-500 text-sm">{data.attachments ? `${data.attachments.length} file dipilih` : 'No files chosen'}</span>
                </div>
                <input id="attachments" type="file" multiple accept="image/*" onChange={e => setData('attachments', e.target.files ? Array.from(e.target.files) : null)} className="hidden" />
                {errors.attachments && <p className="text-red-500 text-sm mt-1">{errors.attachments}</p>}
                {imagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {imagePreview.map((src, idx) => (
                      <img key={idx} src={src} alt="Preview" className="w-24 h-24 object-cover rounded-md border p-1" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Masalah</label>
                <textarea rows={5} placeholder="Ceritakan detail bug yang Anda alami..." value={data.description} onChange={e => setData('description', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={processing} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                  {processing ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
