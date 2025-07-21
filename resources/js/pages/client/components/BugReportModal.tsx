import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// Props yang diterima komponen ini dari Dashboard.tsx
interface BugReportModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any, imagePreviewUrl: string | null) => void;
  auth: { user: any };
}

export default function BugReportModal({ show, onClose, onSubmit, auth }: BugReportModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageFile = watch('image');

  // Efek untuk membuat preview gambar
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data, imagePreview); // Kirim data dan URL preview ke parent
    reset();
    setImagePreview(null);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white p-7 rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold text-gray-800">Bug Service Ticket</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-center">Silakan isi detail permasalahan Anda.</p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={auth.user.name}
                            readOnly
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email@example.com"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">Email diperlukan</p>}
                        </div>
                    </div>

                    {/* Department & Computer ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Penanggung Jawab</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="M.Afzaal, K.Satya...."
                            {...register('penanggungJawab', { required: true })}
                        />
                        {errors.penanggungJawab && <p className="text-red-500 text-sm mt-1">Penanggung jawab diperlukan</p>}
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telpon</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="08****"
                            {...register('nomorTelpon', { required: true })}
                        />
                        {errors.nomorTelpon && <p className="text-red-500 text-sm mt-1">Nomor telpon diperlukan</p>}
                        </div>
                    </div>

                    {/* Upload Screenshot */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot</label>
                        <div className="flex items-center">
                        <label
                            htmlFor="image"
                            className="text-sm inline-block bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-5 rounded-lg cursor-pointer transition-colors"
                        >
                            Choose File
                        </label>
                        <span className="ml-3 text-gray-500 text-sm">
                            {imageFile?.length > 0 ? imageFile[0].name : 'No file chosen'}
                        </span>
                        </div>
                        <input
                        id="image"
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="hidden"
                        />
                        {imagePreview && (
                        <div className="items-center mt-4">
                            <img src={imagePreview} alt="Preview" className="max-w-xs max-h-40 rounded-md" />
                        </div>
                        )}
                    </div>

                    {/* Problem Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Masalah</label>
                        <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={5}
                        placeholder="Ceritakan masalah yang Anda alami..."
                        {...register('deskripsi', { required: true })}
                        ></textarea>
                        {errors.deskripsi && <p className="text-red-500 text-sm mt-1">Deskripsi diperlukan</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                        >
                        Batal
                        </button>
                        <button
                        type="submit"
                        className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
                        >
                        Kirim Laporan
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            )}