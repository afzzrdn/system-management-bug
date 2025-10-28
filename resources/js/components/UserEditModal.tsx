import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

// Tipe data untuk props
interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    asal: string | null;
    role: 'admin' | 'developer' | 'client';
}

interface UserEditModalProps {
    user: User;
    onClose: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        asal: user.asal || '',
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => onClose,
        
            onError: (errors) => {
            alert('Server merespons dengan error:\n\n' + JSON.stringify(errors, null, 2));
        },
        });
    };
    
    useEffect(() => {
        reset({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            asal: user.asal || '',
            role: user.role,
        });
    }, [user]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <h3 className="text-xl font-semibold text-gray-800">Edit Pengguna: {user.name}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {/* Nama */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                            <input
                                id="name" type="text" value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email" type="email" value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        
                        {/* Nomor HP */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor HP</label>
                            <input
                                id="phone" type="text" value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>

                         {/* Asal */}
                         <div>
                            <label htmlFor="asal" className="block text-sm font-medium text-gray-700">Asal</label>
                            <input
                                id="asal" type="text" value={data.asal}
                                onChange={(e) => setData('asal', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.asal && <p className="text-xs text-red-500 mt-1">{errors.asal}</p>}
                        </div>
                        
                        {/* Role */}
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as 'admin' | 'developer' | 'client')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="admin">Admin</option>
                                <option value="developer">Developer</option>
                                <option value="client">Client</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserEditModal;