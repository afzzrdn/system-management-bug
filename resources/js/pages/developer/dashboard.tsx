import ProjectCard from '@/components/ProjectCard';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, AlertTriangle, CheckCircle, Code, Wrench } from 'lucide-react';
import { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  iconBgColor: string;
  href: string;
};

type ProjectCardProps = {
  projectTitle: string,
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
};

const StatCard = ({ icon, title, value, iconBgColor, href }: StatCardProps) => (
  <Link href={href} className="group bg-white p-5 rounded-xl flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div className={`p-[11px] rounded-full ${iconBgColor} text-white w-10 h-10 mb-4 flex-shrink-0`}>{icon}</div>
      <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  </Link>
);

// Helper untuk konversi status
const convertStatus = (status: string): 'Ditinjau' | 'Dikerjakan' | 'Selesai' => {
  switch (status) {
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

export default function Dashboard() {
  const { bugCountFromClients, bugDetails } = usePage<Props>().props;

  const statCardsData: StatCardProps[] = [
    {
      icon: <AlertTriangle size={18} />,
      title: "Bug dari Client",
      value: bugCountFromClients,
      iconBgColor: "bg-red-500",
      href: "#",
    },
    {
      icon: <Wrench size={18} />,
      title: "Sedang Dikerjakan",
      value: bugDetails.filter((b) => b.status === 'in_progress').length,
      iconBgColor: "bg-indigo-500",
      href: "#",
    },
    {
      icon: <CheckCircle size={18} />,
      title: "Bug Selesai",
      value: bugDetails.filter((b) => b.status === 'resolved' || b.status === 'closed').length,
      iconBgColor: "bg-green-600",
      href: "#",
    },
    {
      icon: <Code size={18} />,
      title: "Total Bug",
      value: bugDetails.length,
      iconBgColor: "bg-blue-500",
      href: "#",
    },
  ];

  const projectsData: ProjectCardProps[] = bugDetails.map((bug) => ({
    projectTitle: bug.project ?? '-',
    status: convertStatus(bug.status),
    taskTitle: `[${bug.priority.toUpperCase()}] ${bug.title}`,
    assignee: bug.assignee,
    clientName: bug.reporter,
  }));
console.log(projectsData);

  return (
    
    <AppLayout>
      <Head title="Developer Dashboard" />
      <div className="p-4 md:p-6">
        <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-semibold text-gray-400">Developer Dashboard</h2>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kartu Statistik */}
          <section className="lg:col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {statCardsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="w-full h-[300px] bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-600">Developer Chart</h3>

            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-600 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
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
