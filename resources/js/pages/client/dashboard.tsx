import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Bug, FolderKanban, Eye } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Bug as BugType } from '@/types/bug';
import { Button } from '@/components/ui/button';
import BugDetail from '@/components/BugDetail';

interface RecentBug {
  id: number;
  title: string;
  project: string;
  status: 'open' | 'in_progress' | 'resolved';
  full_bug: BugType;
}

interface DashboardProps {
  auth: { user: any };
  stats: {
    bugReported: number;
    bugFixed: number;
    activeProjects: number;
  };
  recentBugs: RecentBug[];
  devLogs: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
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
  <Link href={href} className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className="flex justify-between">
      <div className={`rounded-full p-3 ${iconBgColor} mb-5 flex h-12 w-12 items-center justify-center text-white`}>{icon}</div>
      <ArrowUpRight size={24} className="mt-1 text-gray-400 transition-colors group-hover:text-gray-800" />
    </div>
    <div>
      <p className="mb-1 text-base font-medium text-gray-500">{title}</p>
      {loading ? <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div> : <p className="text-3xl font-bold text-gray-900">{value}</p>}
    </div>
  </Link>
);

export default function Dashboard({ auth, stats, recentBugs = [], devLogs = [] }: DashboardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<BugType | null>(null);

  const handleViewBug = (bug: BugType) => {
    setSelectedBug(bug);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-100' };
      case 'in_progress':
        return { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-100' };
      case 'resolved':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', ring: 'ring-gray-100' };
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
          <StatCard title="Bug Dilaporkan" value={stats?.bugReported || 0} icon={<Bug size={22} />} iconBgColor="bg-red-500" href={route('client.bugs.index')} loading={!stats} />
          <StatCard title="Bug Diperbaiki" value={stats?.bugFixed || 0} icon={<Bug size={22} />} iconBgColor="bg-green-500" href={route('client.bugs.index', { status: 'resolved' })} loading={!stats} />
          <StatCard title="Jumlah Project" value={stats?.activeProjects || 0} icon={<FolderKanban size={22} />} iconBgColor="bg-blue-500" href={route('client.project')} loading={!stats} />
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-0 shadow-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 p-6 backdrop-blur">
              <h4 className="text-xl font-semibold text-gray-900">Recent Bug Reports</h4>
              <Link href={route('client.bugs.index')} className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 transition hover:bg-gray-100">View All</Link>
            </div>
            {recentBugs.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <FolderKanban className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium">No bug reports</h3>
                <p className="mt-1 text-sm">No bugs have been reported yet</p>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto px-1">
                <ul className="divide-y divide-gray-100">
                  {recentBugs.map((bug) => {
                    const s = getStatusColor(bug.status);
                    return (
                      <li key={bug.id} className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-gray-50/60">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gray-300 group-hover:bg-gray-400"></div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{bug.title}</p>
                            <p className="mt-0.5 truncate text-xs text-gray-500">Project: {bug.project}</p>
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${s.bg} ${s.text} ring-1 ${s.ring}`}>{getStatusText(bug.status)}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewBug(bug.full_bug)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-0 shadow-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 p-6 backdrop-blur">
              <h4 className="text-xl font-semibold text-gray-900">Development Log</h4>
            </div>
            {devLogs.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-lg">📝</span>
                </div>
                <h3 className="text-sm font-medium">No development logs</h3>
                <p className="mt-1 text-sm">Development activities will appear here</p>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto px-1">
                <div className="p-5">
                  <ol className="relative ml-3 border-l border-gray-200">
                    {devLogs.map((log) => (
                      <li key={log.id} className="mb-6 ml-6">
                        <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white">{typeof log.icon === 'string' ? log.icon : '•'}</span>
                        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                          <p className="text-sm font-semibold text-gray-900">{log.title}</p>
                          <p className="mt-1 text-sm text-gray-600">{log.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBug && <BugDetail bug={selectedBug} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />}
    </AppLayout>
  );
}
