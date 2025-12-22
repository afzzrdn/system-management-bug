import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Bell, CodeXml, User, Verified } from 'lucide-react';
import React, { ReactNode, Suspense } from 'react';
import { User as Auth } from '@/types/index'
import { useTour } from '@/tour/TourProvider';

const DashboardCharts = React.lazy(() => import('@/components/admin/DashboardCharts'));

interface DashboardProps {
    auth: { user: Auth };
    userCount: number;
    bugCount: number;
    projectCount: number;
    bugStatusStats: {
        open: number;
        in_progress: number;
        resolved: number;
        closed: number;
    };
    bugPriorityStats: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    bugTrends: {
        labels: string[];
        data: number[];
    };
}

type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    href: string;
};

type PriorityKey = 'low' | 'medium' | 'high' | 'critical';

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

export default function Dashboard({
  userCount, bugCount, projectCount, bugStatusStats, bugPriorityStats, bugTrends
}: DashboardProps) {
    const { start } = useTour();

    const statusData = [
        { name: 'Open', value: bugStatusStats?.open ?? 0 },
        { name: 'In Progress', value: bugStatusStats?.in_progress ?? 0 },
        { name: 'Resolved', value: bugStatusStats?.resolved ?? 0 },
    ];
    const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#22C55E'];

    const priorityOrder: PriorityKey[] = ['low', 'medium', 'high', 'critical'];
    const priorityData = priorityOrder.map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: bugPriorityStats?.[key] ?? 0
    }));
    const PRIORITY_COLORS = ['#60A5FA', '#F59E0B', '#F97316', '#EF4444'];

    const STATUS_COLORS_GRADIENT = statusData.map((_, i) => `url(#statusGradient${i})`);
    const PRIORITY_COLORS_GRADIENT = priorityData.map((_, i) => `url(#priorityGradient${i})`);

    const runTour = () => {
      start(
        [
          { element: '[data-tour="stat-users"]',    popover: { title: 'User Aktif', description: 'Jumlah pengguna terdaftar yang aktif.' } },
          { element: '[data-tour="stat-bugs"]',     popover: { title: 'Laporan Bug', description: 'Total tiket bug yang terdata.' } },
          { element: '[data-tour="stat-projects"]', popover: { title: 'Project', description: 'Jumlah project di sistem.' } },
          { element: '[data-tour="stat-resolved"]', popover: { title: 'Sudah Diselesaikan', description: 'Tiket berstatus resolved.' } },
          { element: '[data-tour="chart-status"]',  popover: { title: 'Statistik Status', description: 'Distribusi status tiket.' } },
          { element: '[data-tour="chart-priority"]',popover: { title: 'Statistik Prioritas', description: 'Distribusi prioritas tiket.' } },
        ],
        { cursor: false, headerOffsetPx: 64 }
      );
    };

    const trendData = (bugTrends?.labels || []).map((label, index) => ({
        name: label,
        count: bugTrends?.data[index] ?? 0
    }));

    return (
        <AppLayout>
            <Head><title>Admin Dashboard</title></Head>

            <div className="p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-gray-400">Admin Dashboard</h2>
                    <button
                      onClick={runTour}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      Tutorial
                    </button>
                </div>

                {/* STAT CARDS */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div data-tour="stat-users"><StatCard icon={<User size={18} />} title="User Aktif" value={userCount} iconBgColor="bg-blue-500" href={route('users.index')} /></div>
                    <div data-tour="stat-bugs"><StatCard icon={<Bell size={18} />} title="Laporan Bug" value={bugCount} iconBgColor="bg-orange-500" href={route('bugs.index')} /></div>
                    <div data-tour="stat-projects"><StatCard icon={<CodeXml size={18} />} title="Project" value={projectCount} iconBgColor="bg-yellow-500" href={route('projects.index')} /></div>
                    <div data-tour="stat-resolved"><StatCard icon={<Verified size={18} />} title="Sudah Diselesaikan" value={bugStatusStats?.resolved ?? 0} iconBgColor="bg-green-500" href={route('bugs.index', { status: 'resolved' })} /></div>
                </div>

                {/* BUG CHARTS */}
                <div className="rounded-2xl bg-white shadow-sm">
                    <div className="px-6 pt-5 pb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Statistik Bug</h3>
                    </div>

                    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading charts...</div>}>
                        <DashboardCharts
                            statusData={statusData}
                            priorityData={priorityData}
                            trendData={trendData}
                            STATUS_COLORS={STATUS_COLORS}
                            STATUS_COLORS_GRADIENT={STATUS_COLORS_GRADIENT}
                            PRIORITY_COLORS={PRIORITY_COLORS}
                            PRIORITY_COLORS_GRADIENT={PRIORITY_COLORS_GRADIENT}
                        />
                    </Suspense>
                </div>
            </div>
        </AppLayout>
    );
}
