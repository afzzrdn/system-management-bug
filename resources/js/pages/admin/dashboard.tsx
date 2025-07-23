import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Bell, CodeXml, User, Verified } from 'lucide-react';
import { ReactNode } from 'react';

// Tipe untuk props komponen
interface DashboardProps {
    auth: { user: any };
    userCount: number;
    bugCount: number;
    projectCount: number;
}

type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    href: string;
};

const StatCard = ({ icon, title, value, iconBgColor, href }: StatCardProps) => (
    <Link href={href} className="group flex flex-col justify-between rounded-xl bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="flex justify-between">
            <div className={`rounded-full p-[11px] ${iconBgColor} mb-4 h-10 w-10 text-white`}>{icon}</div>
            <ArrowUpRight size={20} className="text-gray-400 transition-colors group-hover:text-gray-800" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-semibold text-gray-800">{value}</p>
        </div>
    </Link>
);

export default function Dashboard({ userCount, bugCount, projectCount }: DashboardProps) {
    return (
        <AppLayout>
            <Head>
                <title>Admin Dashboard</title>
            </Head>

            <div className="p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-gray-400">Admin Dashboard</h2>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Menggunakan prop userCount dan route() helper */}
                    <StatCard icon={<User size={18} />} title="User Aktif" value={userCount} iconBgColor="bg-blue-500" href={route('users.index')} />
                    <StatCard icon={<Bell size={18} />} title="Laporan Bug" value={bugCount} iconBgColor="bg-orange-500" href={route('bugs.index')} />
                    <StatCard
                        icon={<CodeXml size={18} />}
                        title="Project"
                        value={projectCount}
                        iconBgColor="bg-yellow-500"
                        href={route('projects.index')}
                    />
                    <StatCard icon={<Verified size={18} />} title="Sudah Diselesaikan" value="7" iconBgColor="bg-green-500" href="#" />
                </div>
            </div>
        </AppLayout>
    );
}
