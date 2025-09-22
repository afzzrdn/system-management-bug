import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Bell, CheckCircle, Mail, Archive, Clock } from 'react-feather';
import axios from 'axios';
import NotificationModal from '@/components/NotificationModal';

// Function to format time in a user-friendly way
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    
    return new Date(dateString).toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
};

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
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications);
    const [loadingNotificationId, setLoadingNotificationId] = useState<number | null>(null);
    const role = auth.user.role;

    const roleTitle = role === 'admin' ? 'Admin'
                     : role === 'developer' ? 'Developer'
                     : 'Client';

    const unreadCount = notificationsList.filter(n => !n.is_read).length;
    const readCount = notificationsList.filter(n => n.is_read).length;

    const filteredNotifications = notificationsList.filter(notif => {
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
            <Head title={`Notifikasi ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />

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
                                    {filteredNotifications.map((notif) => {
                                        const handleNotificationClick = async () => {
                                            // Tampilkan modal dengan detail notifikasi
                                            setSelectedNotification(notif);
                                            setIsModalOpen(true);
                                            
                                            // Tandai sebagai telah dibaca jika belum dibaca
                                            if (!notif.is_read) {
                                                try {
                                                    setLoadingNotificationId(notif.id);
                                                    await axios.post(`/notification/${notif.id}/mark-as-read`);
                                                    // Perbarui notifikasi di UI tanpa reload halaman
                                                    const updatedNotifications = notificationsList.map(item => {
                                                        if (item.id === notif.id) {
                                                            return { ...item, is_read: true };
                                                        }
                                                        return item;
                                                    });
                                                    setNotificationsList(updatedNotifications);
                                                } catch (error) {
                                                    console.error('Error marking notification as read:', error);
                                                } finally {
                                                    setLoadingNotificationId(null);
                                                }
                                            }
                                        };
                                        
                                        return (
                                        <li
                                            key={notif.id}
                                            onClick={handleNotificationClick}
                                            className={`flex items-start space-x-4 p-5 transition-colors duration-200 notification-item ${
                                                notif.is_read ? 'bg-gray-50' : 'bg-white hover:bg-gray-50 cursor-pointer'
                                            }`}
                                        >
                                            <div className={`mt-1 flex-shrink-0 ${notif.is_read ? 'text-gray-400' : 'text-blue-500'}`}>
                                                {loadingNotificationId === notif.id ? (
                                                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                                ) : (
                                                    notif.is_read ? <CheckCircle size={20} /> : <Bell size={20} />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h3 className={`text-md font-semibold ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h3>
                                                    {!notif.is_read && (
                                                        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-500" title="Belum dibaca"></div>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                                                <div className="mt-2 flex items-center text-xs text-gray-400">
                                                    <Clock size={12} className="mr-1" />
                                                    {formatTimeAgo(notif.created_at)}
                                                </div>
                                            </div>
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        ) : filter === 'unread' && unreadCount === 0 ? (
                            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <CheckCircle size={48} className="text-green-500" />
                                <h3 className="mt-4 text-lg font-medium text-gray-800">Semua notifikasi telah dibaca!</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Anda tidak memiliki notifikasi yang belum dibaca saat ini.
                                </p>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                <Bell size={48} className="text-gray-300" />
                                <h3 className="mt-4 text-lg font-medium text-gray-800">Tidak Ada Notifikasi</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Tidak ada notifikasi yang telah dibaca.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {/* Modal untuk menampilkan detail notifikasi */}
            {selectedNotification && (
                <NotificationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        // Tidak perlu reload halaman karena status sudah diperbarui di UI
                    }}
                    title={selectedNotification.title}
                    message={selectedNotification.message}
                    createdAt={selectedNotification.created_at}
                />
            )}
        </AppLayout>
    );
}
