import ProjectCard from '@/components/ProjectCard';
import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import { ArrowUpRight, AlertTriangle, CheckCircle, Code, Wrench } from 'lucide-react';
import { ReactNode } from 'react';

// --- Tipe Properti (Props Types) ---
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

type ProjectCardProps = {
    projectTitle: string;
    status: 'Ditinjau' | 'Dikerjakan' | 'Selesai';
    taskTitle: string;
    assignee: string;
};

// --- Data untuk Komponen ---
const statCardsData: StatCardProps[] = [
    { icon: <Code size={18} />, title: "Total Task Diterima", value: "42", iconBgColor: "bg-blue-500", href: "#" },
    { icon: <Wrench size={18} />, title: "Task Dalam Proses", value: "18", iconBgColor: "bg-indigo-500", href: "#" },
    { icon: <CheckCircle size={18} />, title: "Task Selesai", value: "21", iconBgColor: "bg-green-600", href: "#" },
    { icon: <AlertTriangle size={18} />, title: "Bug Belum Ditangani", value: "3", iconBgColor: "bg-red-500", href: "#" }
];

const projectsData: ProjectCardProps[] = [
    { projectTitle: "System Mitigasi Wilayah Berbasis GIS", status: "Ditinjau", taskTitle: "[BUG] Gambar Tidak Tersimpan", assignee: "Clyrova Tech" },
    { projectTitle: "Monitoring Kerusakan Jalan Nasional", status: "Dikerjakan", taskTitle: "[FEATURE] Notifikasi Real-time", assignee: "Clyrova Tech" },
    { projectTitle: "Sistem Pelaporan Masyarakat Digital", status: "Selesai", taskTitle: "[REFACTOR] Optimasi Query", assignee: "Clyrova Tech" }
];

// --- Komponen ---
const StatCard = ({ icon, title, value, iconBgColor, href }: StatCardProps) => (
    <Link href={href} className="group bg-white p-5 rounded-xl flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
        <div className='flex justify-between items-start'>
            <div className={`p-[11px] rounded-full ${iconBgColor} text-white w-10 h-10 mb-4 flex-shrink-0`}>{icon}</div>
            <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-semibold text-gray-800">{value}</p>
        </div>
    </Link>
);

export default function Dashboard() {

    return (
        <AppLayout>
            <Head title="Developer Dashboard" />
            <div className="p-4 md:p-6">
                <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Developer Dashboard</h2>
                    
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Kolom Statistik & Chart (Mengambil 2 bagian di layar besar) */}
                    <section className="lg:col-span-2 flex flex-col gap-8">
                        {/* Bagian Kartu Statistik */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {statCardsData.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>
                        
                        {/* Placeholder untuk Chart atau Konten Baru */}
                        <div className='w-full h-[300px] bg-white rounded-xl shadow-sm p-4'>
                            <h3 className="font-semibold text-gray-600">Placeholder untuk Chart</h3>
                            {/* Anda bisa meletakkan komponen chart di sini */}
                        </div>
                    </section>
                    
                    {/* Kolom Proyek Terbaru (Mengambil 1 bagian di layar besar) */}
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