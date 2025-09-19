import React from 'react';

interface UserDetailProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        asal: string;
        role: string;
    };
    onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                    ✕
                </button>

                <h3 className="text-lg font-semibold mb-4">Detail Pengguna</h3>

                <div className="space-y-2">
                    <p><strong>Nama:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Nomor HP:</strong> {user.phone || '-'}</p>
                    <p><strong>Asal:</strong> {user.asal || '-'}</p>
                    <p><strong>Role:</strong> {user.role}</p>

                    {user.role === 'developer' && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                            <p className="font-medium">👨‍💻 Developer Details</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>Bisa melihat dan menangani bug</li>
                                <li>Memiliki akses fitur teknis</li>
                            </ul>
                        </div>
                    )}

                    {user.role === 'client' && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded">
                            <p className="font-medium">👤 Client Details</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>Bisa melaporkan bug</li>
                                <li>Hanya melihat progres proyek</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
