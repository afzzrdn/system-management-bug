import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Bell, CodeXml, User, Verified } from 'lucide-react';
import { ReactNode } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { User as Auth } from '@/types/index'

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
                                      userCount, bugCount, projectCount, bugStatusStats, bugPriorityStats,
                                  }: DashboardProps) {
    // DATA: Status
    const statusData = [
        { name: 'Open', value: bugStatusStats?.open ?? 0 },
        { name: 'In Progress', value: bugStatusStats?.in_progress ?? 0 },
        { name: 'Resolved', value: bugStatusStats?.resolved ?? 0 },
    ];
    const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#22C55E'];

    const priorityOrder: PriorityKey[] = ['low', 'medium', 'high', 'critical'];
    // DATA: Priority
    const priorityData = priorityOrder.map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: bugPriorityStats?.[key] ?? 0
    }));
    const PRIORITY_COLORS = ['#60A5FA', '#F59E0B', '#F97316', '#EF4444'];

    // Gradient references
    const STATUS_COLORS_GRADIENT = statusData.map((_, i) => `url(#statusGradient${i})`);
    const PRIORITY_COLORS_GRADIENT = priorityData.map((_, i) => `url(#priorityGradient${i})`);

    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
        if ((percent ?? 0) === 0) return null;
        const RAD = Math.PI / 180;
        const r = (innerRadius ?? 0) + ((outerRadius ?? 0) - (innerRadius ?? 0)) * 0.6;
        const x = (cx ?? 0) + r * Math.cos(-midAngle * RAD);
        const y = (cy ?? 0) + r * Math.sin(-midAngle * RAD);

        return (
            <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-sm font-semibold text-gray-50 drop-shadow-sm"
            >
                {`${((percent ?? 0) * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <AppLayout>
            <Head><title>Admin Dashboard</title></Head>

            <div className="p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-gray-400">Admin Dashboard</h2>
                </div>

                {/* STAT CARDS */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={<User size={18} />} title="User Aktif" value={userCount} iconBgColor="bg-blue-500" href={route('users.index')} />
                    <StatCard icon={<Bell size={18} />} title="Laporan Bug" value={bugCount} iconBgColor="bg-orange-500" href={route('bugs.index')} />
                    <StatCard icon={<CodeXml size={18} />} title="Project" value={projectCount} iconBgColor="bg-yellow-500" href={route('projects.index')} />
                    <StatCard icon={<Verified size={18} />} title="Sudah Diselesaikan" value={bugStatusStats?.resolved ?? 0} iconBgColor="bg-green-500" href={route('bugs.index', { status: 'resolved' })} />
                </div>

                {/* BUG CHARTS */}
                <div className="rounded-2xl bg-white shadow-sm">
                    <div className="px-6 pt-5 pb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Statistik Bug</h3>
                    </div>

                    <div className="px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* STATUS CHART */}
                        <div className="flex flex-col">
                            <h4 className="mb-2 text-center text-lg font-medium text-gray-600">Status</h4>
                            <div className="h-[340px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            {statusData.map((_, i) => (
                                                <linearGradient key={i} id={`statusGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor={STATUS_COLORS[i]} stopOpacity={0.8}/>
                                                    <stop offset="100%" stopColor={STATUS_COLORS[i]} stopOpacity={0.4}/>
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }}/>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="56%"
                                            innerRadius={60}
                                            outerRadius={110}
                                            labelLine={false}
                                            label={renderLabel}
                                            dataKey="value"
                                            isAnimationActive={true}
                                            animationDuration={800}
                                        >
                                            {statusData.map((_, i) => (
                                                <Cell key={i} fill={STATUS_COLORS_GRADIENT[i % STATUS_COLORS_GRADIENT.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ fontSize: '14px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
                                            formatter={(v: number, n: string) => [`${v} bug`, n]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* PRIORITY CHART */}
                        <div className="flex flex-col">
                            <h4 className="mb-2 text-center text-lg font-medium text-gray-600">Prioritas</h4>
                            <div className="h-[340px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            {priorityData.map((_, i) => (
                                                <linearGradient key={i} id={`priorityGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor={PRIORITY_COLORS[i]} stopOpacity={0.8}/>
                                                    <stop offset="100%" stopColor={PRIORITY_COLORS[i]} stopOpacity={0.4}/>
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }}/>
                                        <Pie
                                            data={priorityData}
                                            cx="50%"
                                            cy="56%"
                                            innerRadius={60}
                                            outerRadius={110}
                                            labelLine={false}
                                            label={renderLabel}
                                            dataKey="value"
                                            isAnimationActive={true}
                                            animationDuration={800}
                                        >
                                            {priorityData.map((_, i) => (
                                                <Cell key={i} fill={PRIORITY_COLORS_GRADIENT[i % PRIORITY_COLORS_GRADIENT.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ fontSize: '14px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
                                            formatter={(v: number, n: string) => [`${v} bug`, n]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
