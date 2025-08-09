import ProjectCard from '@/components/ProjectCard';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle, Code, Wrench, FolderOpenDot } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { ReactNode } from 'react';

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

// ---- Helper Components ----
const StatCard = ({ icon, title, value, iconBgColor, href }: StatCardProps) => (
  <Link
    href={href}
    className="group bg-white p-5 rounded-xl flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
  >
    <div className="flex justify-between items-start">
      <div
        className={`p-[11px] rounded-full ${iconBgColor} text-white w-10 h-10 mb-4 flex-shrink-0`}
      >
        {icon}
      </div>
      <ArrowUpRight
        size={20}
        className="text-gray-400 group-hover:text-gray-800 transition-colors"
      />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  </Link>
);

// ---- Helper Functions ----
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

const getBugCountByStatus = (
  bugs: Bug[],
  status: 'Ditinjau' | 'Dikerjakan' | 'Selesai'
): number => bugs.filter((b) => convertStatus(b.status) === status).length;

// ---- Main Component ----
export default function Dashboard() {
  const { bugCountFromClients, bugDetails } = usePage<Props>().props;

  // Buat data kartu statistik
  const statCardsData: StatCardProps[] = [
    {
      icon: <FolderOpenDot size={18} />,
      title: 'Bug Ditinjau',
      value: getBugCountByStatus(bugDetails, 'Ditinjau'),
      iconBgColor: 'bg-yellow-500',
      href: '#',
    },
    {
      icon: <Wrench size={18} />,
      title: 'Sedang Dikerjakan',
      value: getBugCountByStatus(bugDetails, 'Dikerjakan'),
      iconBgColor: 'bg-purple-500',
      href: '#',
    },
    {
      icon: <CheckCircle size={18} />,
      title: 'Bug Selesai',
      value: getBugCountByStatus(bugDetails, 'Selesai'),
      iconBgColor: 'bg-green-500',
      href: '#',
    },
    {
      icon: <Code size={18} />,
      title: 'Total Bug',
      value: bugDetails.length,
      iconBgColor: 'bg-blue-500',
      href: '#',
    },
  ];

  // Buat data kartu project
  const projectsData: ProjectCardProps[] = bugDetails.map((bug) => ({
    projectTitle: bug.project ?? '-',
    status: convertStatus(bug.status),
    taskTitle: `[${bug.priority?.toUpperCase() || 'UNKNOWN'}] ${bug.title}`,
    assignee: bug.assignee || '-',
    clientName: bug.reporter || '-',
  }));

    const COLORS = ['#F59E0B', '#8B5CF6', '#22C55E'];

    const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const getStatusCounts = (bugs: Bug[]) => {
  const counts = {
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  };

  bugs.forEach((bug) => {
    const status = bug.status?.toLowerCase();
    if (status in counts) {
      counts[status as keyof typeof counts]++;
    }
  });

  return counts;
};

const { bugStatusStats = { open: 0, in_progress: 0, resolved: 0, closed: 0 } } = usePage<Props>().props;

const StatusData = [
  { name: 'Open', value: bugStatusStats.open },
  { name: 'In Progress', value: bugStatusStats.in_progress },
  { name: 'Resolved', value: bugStatusStats.resolved },
];


  return (
    <AppLayout>
    <Head title="Developer Dashboard" />
    <div className="p-4 md:p-6">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-400">Developer Dashboard</h2>
            </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kartu Statistik */}
          <section className="lg:col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {statCardsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="rounded-2xl bg-white shadow-sm">
            {/* Header */}
            <div className="px-6 pt-5 pb-4">
                <h3 className=" text-xl font-semibold text-gray-800">Statistik Bug</h3>
                <p className="mt-1 text-sm text-gray-500">Status</p>
            </div>

            {/* Chart */}
            <div className="px-4 md:px-6 py-6">
                <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Legend
                        layout="horizontal"
                        verticalAlign="top"
                        align="center"
                        wrapperStyle={{ paddingBottom: 8 }}
                    />
                    <Pie
                        data={StatusData}
                        cx="50%"
                        cy="56%"
                        outerRadius={110}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        dataKey="value"
                        isAnimationActive={false}
                    >
                        {StatusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ fontSize: '14px' }}
                        formatter={(v: number, n: string) => [`${v} bug`, n]}
                    />
                    </PieChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>

          </section>
          {/* Aktivitas Terbaru */}
          <section>
            <h3 className="text-xl font-semibold text-center text-gray-600 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4 max-h-[795px] overflow-y-auto pr-2 bg-white rounded-xl shadow-sm">
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
