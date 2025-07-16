import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    const handleLogout = () => {
        router.post('/logout', {}, {
            onSuccess: () => router.visit('/login'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Dashboard</title>
            </Head>

            <div className="bg-white p-6 rounded shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
                <p className="text-gray-700">This is your starting point.</p>
            </div>
        </AppLayout>
    );
}
