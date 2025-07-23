import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Notifications() {
    return (
        <AppLayout>
            <Head title="Notifikasi" />

            <div className="p-8">
                {/* Header tetap sama seperti permintaan */}
                <h1 className="text-2xl font-semibold text-gray-400 mb-6">Customer Service</h1>

                
            </div>
        </AppLayout>
    );
}