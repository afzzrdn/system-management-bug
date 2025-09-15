import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ProjectDetailModal from '@/components/ProjectDetail';
import ProjectTable from '@/components/ProjectTable';
import axios from 'axios';
import { useTour } from '@/tour/TourProvider';

type Project = {
  id: number;
  name: string;
  description: string | null;
  client_id: number;
  client?: { id: number; name: string };
  bugs?: any[];
};

type PageProps = {
  projects?: Project[];
};

export default function ClientProjectsPage() {
  const { projects: projectsFromProps } = usePage<PageProps>().props;
  const projects = projectsFromProps ?? [];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const { start } = useTour();

  const runTour = () => {
    start(
      [
        { element: '[data-tour="projects-title"]', popover: { title: 'Project Saya', description: 'Semua project yang kamu miliki dan pantau.' } },
        { element: '[data-tour="projects-table"]', popover: { title: 'Daftar Project', description: 'Klik sebuah project untuk melihat detail, bug, dan aktivitas.' } },
      ],
      { cursor: false, headerOffsetPx: 64 }
    );
  };

  const openDetail = async (project: Project) => {
    setIsLoadingDetail(true);
    setSelectedProject(null);
    try {
      const { data } = await axios.get(`/client/project/${project.id}`);
      setSelectedProject(data.project);
    } catch {
      alert('Gagal memuat detail project. Silakan coba lagi.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeDetail = () => setSelectedProject(null);

  return (
    <AppLayout>
      <Head title="Project Saya" />
      <div className="p-8 max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 data-tour="projects-title" className="text-2xl font-bold text-gray-400">Project Saya</h2>
          <button
            onClick={runTour}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
          >
            Tutorial
          </button>
        </div>
        <div data-tour="projects-table">
          <ProjectTable
            projects={projects}
            context="client"
            onEdit={undefined as any}
            onDelete={undefined as any}
            onDetail={openDetail}
          />
        </div>
      </div>
      {selectedProject && (
        <div data-tour="project-detail-modal">
          <ProjectDetailModal project={selectedProject} onClose={closeDetail} />
        </div>
      )}
    </AppLayout>
  );
}
