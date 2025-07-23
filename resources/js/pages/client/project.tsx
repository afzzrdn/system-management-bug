import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const project = () => {
    return (
        <AppLayout>
            <Head>
                <title>Manajemen Project</title>
            </Head>
            <div className='p-7'>
                <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
                    <h2 className="text-2xl font-semibold text-gray-400">Manajemen Project</h2>
                </div>
                <div>
                    <div className='w-full'>
                        <p></p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default project;
