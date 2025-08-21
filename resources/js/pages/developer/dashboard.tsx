import ProjectCard from '@/components/ProjectCard';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle, Code, Wrench, FolderOpenDot, PlayCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid } from 'recharts';
import { ReactNode, useState } from 'react';
import { useTour } from '@/tour/TourProvider';

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  iconBgColor: string;
  href: string;
};

type ProjectCardProps = {
  projectTitle: string;
  status: 'Ditinjau' | 'Dikerjakan' | 'Selesai';
  taskTitle: string;
  assignee: string;
  clientName: string;
};

type Bug = {
  id: number;
  title: string;
  priority: string;
  status: string;
  project: string;
  reporter: string;
  assignee: string;
  created_at: string;
};

type Props = {
  bugCountFromClients: number;
  bugDetails: Bug[];
  bugStatusStats: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
};

type PropsTrends = { myTrends?: { labels:string[]; resolvedCounts:number[]; avgLeadHours:number } };

const StatCard = ({ icon, title, value, iconBgColor, href }: StatCardProps) => (
  <a
    href={href}
    className="group bg-white p-5 rounded-xl flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
  >
    <div className="flex justify-between items-start">
      <div className={`p-[11px] rounded-full ${iconBgColor} text-white w-10 h-10 mb-4 flex-shrink-0`}>
        {icon}
      </div>
      <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  </a>
);

const convertStatus = (status: string): 'Ditinjau' | 'Dikerjakan' | 'Selesai' => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'Ditinjau';
    case 'in_progress':
      return 'Dikerjakan';
    case 'resolved':
    case 'closed':
      return 'Selesai';
    default:
      return 'Ditinjau';
  }
};

const getBugCountByStatus = (bugs: Bug[], status: 'Ditinjau' | 'Dikerjakan' | 'Selesai') =>
  bugs.filter((b) => convertStatus(b.status) === status).length;

export default function Dashboard() {
  const { bugCountFromClients, bugDetails, bugStatusStats = { open: 0, in_progress: 0, resolved: 0, closed: 0 } } =
    usePage<Props>().props;

    const { myTrends } = usePage<{ /*...*/ } & PropsTrends>().props;
    const lineData = (myTrends?.labels || []).map((lbl, i) => ({
    name: lbl,
    selesai: myTrends?.resolvedCounts?.[i] ?? 0
    }));

  const { start } = useTour();

  const statCardsData: StatCardProps[] = [
    { icon: <FolderOpenDot size={18} />, title: 'Bug Ditinjau', value: getBugCountByStatus(bugDetails, 'Ditinjau'), iconBgColor: 'bg-yellow-500', href: '#' },
    { icon: <Wrench size={18} />, title: 'Sedang Dikerjakan', value: getBugCountByStatus(bugDetails, 'Dikerjakan'), iconBgColor: 'bg-purple-500', href: '#' },
    { icon: <CheckCircle size={18} />, title: 'Bug Selesai', value: getBugCountByStatus(bugDetails, 'Selesai'), iconBgColor: 'bg-green-500', href: '#' },
    { icon: <Code size={18} />, title: 'Total Bug', value: bugDetails.length, iconBgColor: 'bg-blue-500', href: '#' },
  ];

  const projectsData: ProjectCardProps[] = bugDetails.map((bug) => ({
    projectTitle: bug.project ?? '-',
    status: convertStatus(bug.status),
    taskTitle: `[${bug.priority?.toUpperCase() || 'UNKNOWN'}] ${bug.title}`,
    assignee: bug.assignee || '-',
    clientName: bug.reporter || '-',
  }));

  const COLORS = ['#F59E0B', '#8B5CF6', '#22C55E'];
  const gradientIds = ['statusGradient0', 'statusGradient1', 'statusGradient2'];


  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelRenderProps) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const cxNum = Number(cx ?? 0);
    const cyNum = Number(cy ?? 0);
    const inner = Number(innerRadius ?? 0);
    const outer = Number(outerRadius ?? 0);
    const radius = inner + (outer - inner) * 0.6;
    const x = cxNum + radius * Math.cos(-midAngle * RAD);
    const y = cyNum + radius * Math.sin(-midAngle * RAD);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold drop-shadow-sm"
      >
        {`${((percent ?? 0) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const StatusData = [
    { name: 'Open', value: bugStatusStats.open },
    { name: 'In Progress', value: bugStatusStats.in_progress },
    { name: 'Resolved', value: bugStatusStats.resolved },
  ];

  const runTour = () => {
    start(
      [
        {
          element: '#dev-stat-cards',
          popover: {
            title: 'Gambaran Umum',
            description:
              'Empat kartu ini nunjukin ringkasan pekerjaan: sedang ditinjau, dikerjakan, selesai, dan total bug.',
          },
        },
        {
          element: '#dev-bug-chart',
          popover: {
            title: 'Statistik Status',
            description:
              'Diagram donat untuk distribusi status bug. Hover untuk lihat jumlahnya.',
          },
        },
        {
          element: '#dev-activity-list',
          popover: {
            title: 'Aktivitas Terbaru',
            description:
              'Kartu aktivitas terbaru dari project/bug. Cara cepat menangkap konteks harian.',
          },
        },
      ],
      { cursor: true }
    );
  };

  return (
    <AppLayout>
      <Head title="Developer Dashboard" />
      <div className="p-4 md:p-6">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-2xl font-semibold text-gray-400">Developer Dashboard</h2>

          {/* ⬇️ tombol tutorial */}
          <button
            onClick={runTour}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50"
          >
            <PlayCircle className="h-4 w-4" />
            Tonton Tutorial
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kartu Statistik */}
          <section id="dev-stat-cards" className="lg:col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {statCardsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Chart */}
            <div id="dev-bug-chart" className="rounded-2xl bg-white shadow-sm mt-6">
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-xl font-semibold text-gray-800">Statistik Bug</h3>
                <p className="mt-1 text-sm text-gray-500">Status</p>
              </div>

              <div className="px-4 md:px-6 py-6">
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {StatusData.map((_, i) => (
                          <linearGradient key={i} id={gradientIds[i]} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={COLORS[i]} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={COLORS[i]} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }} />
                      <Pie
                        data={StatusData}
                        cx="50%"
                        cy="56%"
                        innerRadius={60}
                        outerRadius={110}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={800}
                      >
                        {StatusData.map((_, i) => (
                          <Cell key={i} fill={`url(#${gradientIds[i]})`} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          fontSize: '14px',
                          borderRadius: '8px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                        }}
                        formatter={(v: number, n: string) => [`${v} bug`, n]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* Aktivitas Terbaru */}
          <section id="dev-activity-list">
            <h3 className="text-xl font-semibold text-center text-gray-600 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4 max-h-[815px] overflow-y-auto pr-2 rounded-xl">
              {projectsData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}
