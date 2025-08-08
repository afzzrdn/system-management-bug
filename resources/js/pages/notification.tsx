import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Bell, CheckCircle, Mail, Archive } from 'react-feather';

// --- Interface (tidak berubah) ---
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
    auth: {
        user: {
            id: number;
            name: string;
            role: 'client' | 'developer' | 'admin';
        };
    }
}

// --- Komponen ---
export default function Notifications({ notifications, auth }: Props) {
    const [filter, setFilter] = useState<'unread' | 'read'>('unread');
    const role = auth.user.role;

    const roleTitle = role === 'admin' ? 'Admin'
                     : role === 'developer' ? 'Developer'
                     : 'Client';

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const readCount = notifications.filter(n => n.is_read).length;

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.is_read;
        if (filter === 'read') return notif.is_read;
        return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const SidebarFilterButton = ({ type, text, count, icon }: { type: 'unread' | 'read', text: string, count: number, icon: React.ReactNode }) => (
        <button
            onClick={() => setFilter(type)}
            className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                filter === type
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            {icon}
            <span className="flex-grow">{text}</span>
            <span className={`rounded-full px-2 text-xs font-semibold ${
                 filter === type ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
            }`}>
                {count}
            </span>
        </button>
    );

    return (
        <AppLayout>
            <Head title="Notifikasi" />

            <div className="p-8">
                {/* Header tetap sama seperti permintaan */}
                <h1 className="text-2xl font-semibold text-gray-400 mb-6">Notifikasi {roleTitle}</h1>

                <div className="flex flex-col space-y-8 md:flex-row md:space-x-10 md:space-y-0">
                    {/* --- Sidebar untuk Filter --- */}
                    <aside className="w-full md:w-64">
                        <nav className="space-y-2">
                           <SidebarFilterButton type="unread" text="Belum Dibaca" count={unreadCount} icon={<Mail size={18} />} />
                           <SidebarFilterButton type="read" text="Telah Dibaca" count={readCount} icon={<Archive size={18} />} />
                        </nav>
                    </aside>

                    {/* --- Konten Notifikasi --- */}
                    <main className="flex-1">
                        {filteredNotifications.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {filteredNotifications.map((notif) => (
                                        <li
                                            key={notif.id}
                                            className={`flex items-start space-x-4 p-5 transition-colors ${
                                                notif.is_read ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className={`mt-1 flex-shrink-0 ${notif.is_read ? 'text-gray-400' : 'text-blue-500'}`}>
                                                {notif.is_read ? <CheckCircle size={20} /> : <Bell size={20} />}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h3 className={`text-md font-semibold ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h3>
                                                    {!notif.is_read && (
                                                        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-500" title="Belum dibaca"></div>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                                                <p className="mt-2 text-xs text-gray-400">
                                                    {new Date(notif.created_at).toLocaleString('id-ID', {
                                                        dateStyle: 'long',
                                                        timeStyle: 'short',
                                                    })}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <Bell size={48} className="text-gray-300" />
                                <h3 className="mt-4 text-lg font-medium text-gray-800">Tidak Ada Notifikasi</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {filter === 'unread' ? 'Semua notifikasi sudah Anda baca.' : 'Tidak ada notifikasi yang telah dibaca.'}
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
