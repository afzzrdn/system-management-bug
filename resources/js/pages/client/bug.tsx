import React, { useEffect, useState } from 'react';
import { usePage, Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type BugFormData = {
  email: string;
  penanggungJawab: string;
  nomorTelpon: string;
  image: File | null;
  deskripsi: string;
};

type PageProps = {
  auth: {
    user: {
      name: string;
    }
  }
}

export default function LaporBug() {
  const { auth } = usePage<PageProps>().props;

  const { data, setData, post, processing, errors, reset } = useForm<BugFormData>({
    email: '',
    penanggungJawab: '',
    nomorTelpon: '',
    image: null,
    deskripsi: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (data.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(data.image);
    } else {
      setImagePreview(null);
    }
  }, [data.image]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('bugs.store'), {
      onSuccess: () => {
        reset();
        setImagePreview(null);
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input type="text" className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" value={auth.user.name} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" placeholder="email@example.com" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Penanggung Jawab</label>
                  <input type="text" placeholder="Nama penanggung jawab..." value={data.penanggungJawab} onChange={e => setData('penanggungJawab', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  {errors.penanggungJawab && <p className="text-red-500 text-sm mt-1">{errors.penanggungJawab}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <input type="text" placeholder="08..." value={data.nomorTelpon} onChange={e => setData('nomorTelpon', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  {errors.nomorTelpon && <p className="text-red-500 text-sm mt-1">{errors.nomorTelpon}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot</label>
                <div className="flex items-center">
                  <label htmlFor="image" className="text-sm inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg cursor-pointer transition-colors">Choose File</label>
                  <span className="ml-3 text-gray-500 text-sm">{data.image ? data.image.name : 'No file chosen'}</span>
                </div>
                <input id="image" type="file" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} className="hidden" />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                {imagePreview && (<div className="mt-4"><img src={imagePreview} alt="Preview" className="max-w-xs max-h-40 rounded-md border p-1" /></div>)}
              </div>
    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Masalah</label>
                <textarea rows={5} placeholder="Ceritakan detail bug yang Anda alami..." value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
                {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
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
