import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Bell, User, ArrowUpRight, Verified, CodeXml } from 'lucide-react';
import { ReactNode } from 'react';

// Tipe untuk props komponen
interface DashboardProps {
    auth: { user: any };
    userCount: number;
}

type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    href: string;
};

const StatCard = ({ icon, title, value, iconBgColor, href }: StatCardProps) => (
    <Link href={href} className="group bg-white p-5 rounded-xl flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
        <div className='flex justify-between'>
            <div className={`p-[11px] rounded-full ${iconBgColor} text-white w-10 h-10 mb-4`}>
                {icon}
            </div>
            <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-semibold text-gray-800">{value}</p>
        </div>
    </Link>
);


// Menerima props 'userCount'
export default function Dashboard({ userCount }: DashboardProps) {
    return (
        <AppLayout>
            <Head>
                <title>Admin Dashboard</title>
            </Head>

            <div className="p-1 md:p-4">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-semibold text-gray-400">Admin Dashboard</h2>
                    
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Menggunakan prop userCount dan route() helper */}
                    <StatCard
                        icon={<User size={18} />}
                        title="User Aktif"
                        value={userCount} 
                        iconBgColor="bg-blue-500"
                        href={route('users.index')}
                    />
                    <StatCard icon={<Bell size={18} />} title="Laporan Bug" value="15" iconBgColor="bg-orange-500" href='#' />
                    <StatCard icon={<CodeXml size={18} />} title="Sedang Dikerjakan" value="30" iconBgColor="bg-yellow-500" href='#' />
                    <StatCard icon={<Verified size={18} />} title="Sudah Diselesaikan" value="7" iconBgColor="bg-green-500" href='#' />
                </div>

            </div>
        </AppLayout>
    );
}