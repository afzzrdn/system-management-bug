import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head>
                <title>Client Dashboard</title>
            </Head>

            <div className="p-1 md:p-4">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-semibold text-gray-400">Client Dashboard</h2>
                    
                </div>
            </div>
        </AppLayout>
    );
}