import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Bug, FolderKanban } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardProps {
    auth: { user: any };
    stats: {
        bugReported: number;
        bugFixed: number;
        activeProjects: number;
    };
    recentBugs: Array<{
        id: number;
        title: string;
        project: string;
        status: 'open' | 'in_progress' | 'resolved';
    }>;
    devLogs: Array<{
        id: number;
        title: string;
        description: string;
        icon: string;
    }>;
    serviceProgress: Array<{
        id: number;
        title: string;
        progress: number;
        status: string;
        assignee: string;
    }>;
}

type StatCardProps = {
    icon: ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    href: string;
    loading?: boolean;
};

const StatCard = ({ icon, title, value, iconBgColor, href, loading }: StatCardProps) => (
    <Link
        href={href}
        className="group flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
        <div className="flex justify-between">
            <div className={`rounded-full p-3 ${iconBgColor} mb-5 flex h-12 w-12 items-center justify-center text-white`}>{icon}</div>
            <ArrowUpRight size={24} className="mt-1 text-gray-400 transition-colors group-hover:text-gray-800" />
        </div>
        <div>
            <p className="mb-1 text-base font-medium text-gray-500">{title}</p>
            {loading ? (
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
            ) : (
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            )}
        </div>
    </Link>
);

export default function Dashboard({ auth, stats, recentBugs = [], devLogs = [], serviceProgress = [] }: DashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return { bg: 'bg-red-100', text: 'text-red-700' };
            case 'in_progress':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
            case 'resolved':
                return { bg: 'bg-green-100', text: 'text-green-700' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700' };
        }
    };
    const getStatusText = (status: string) => {
        switch (status) {
            case 'open':
                return 'Open';
            case 'in_progress':
                return 'In Progress';
            case 'resolved':
                return 'Resolved';
            default:
                return status;
        }
    };
    return (
        <AppLayout>
            <Head>
                <title>Client Dashboard</title>
            </Head>
            <div className="p-5 md:p-7">
                <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-400">Client Dashboard</h2>
                    </div>
                </header>

                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Bug Dilaporkan"
                        value={stats?.bugReported || 0}
                        icon={<Bug size={22} />}
                        iconBgColor="bg-red-500"
                        href="#"
                        loading={!stats}
                    />
                    <StatCard
                        title="Bug Diperbaiki"
                        value={stats?.bugFixed || 0}
                        icon={<Bug size={22} />}
                        iconBgColor="bg-green-500"
                        href="#"
                        loading={!stats}
                    />
                    <StatCard
                        title="Jumlah Project"
                        value={stats?.activeProjects || 0}
                        icon={<FolderKanban size={22} />}
                        iconBgColor="bg-blue-500"
                        href="#"
                        loading={!stats}
                    />
                </div>
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h4 className="text-xl font-bold text-gray-800">Recent Bug Reports</h4>
                            <Link href="#" className="text-sm font-medium text-blue-500 hover:underline">
                                View All
                            </Link>
                        </div>
                        {recentBugs.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium">No bug reports</h3>
                                <p className="mt-1 text-sm">No bugs have been reported yet</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {recentBugs.map((bug) => {
                                    const statusColor = getStatusColor(bug.status);
                                    return (
                                        <li key={bug.id} className="flex items-center justify-between border-b border-gray-100 py-3">
                                            <div>
                                                <span className="block font-medium text-gray-700">{bug.title}</span>
                                                <span className="text-sm text-gray-500">Project: {bug.project}</span>
                                            </div>
                                            <span className={`px-3 py-1 ${statusColor.bg} ${statusColor.text} rounded-full text-sm font-medium`}>
                                                {getStatusText(bug.status)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h4 className="mb-5 text-xl font-bold text-gray-800">Development Log</h4>
                        {devLogs.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <span className="text-gray-400">📝</span>
                                </div>
                                <h3 className="mt-2 text-sm font-medium">No development logs</h3>
                                <p className="mt-1 text-sm">Development activities will appear here</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {devLogs.map((log) => (
                                    <li key={log.id} className="flex items-start">
                                        <div className="mt-1 mr-3 rounded-full bg-blue-100 p-2 text-blue-700">
                                            <span className="block h-5 w-5 text-center">{log.icon}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">{log.title}</p>
                                            <p className="text-sm text-gray-500">{log.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
