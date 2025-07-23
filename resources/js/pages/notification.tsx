import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    notifications: Notification[];
}

export default function Notifications({ notifications }: Props) {
    return (
        <AppLayout>
            <Head title="Notifikasi" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-400 mb-6">Notifikasi</h1>

                {notifications.length === 0 ? (
                    <div className="text-gray-500">Tidak ada notifikasi saat ini.</div>
                ) : (
                    <ul className="space-y-4">
                        {notifications.map((notif) => (
                            <li
                                key={notif.id}
                                className={`rounded border-l-4 p-4 shadow-sm transition ${
                                    notif.is_read ? 'border-gray-300 bg-gray-100' : 'border-blue-500 bg-white'
                                }`}
                            >
                                <div className="font-semibold text-gray-800">{notif.title}</div>
                                <p className="text-sm text-gray-600">{notif.message}</p>
                                <p className="mt-2 text-xs text-gray-400">{new Date(notif.created_at).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AppLayout>
    );
}
