import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ProjectDetailModal from '@/components/ProjectDetail';
import ProjectTable from '@/components/ProjectTable';
import axios from 'axios';

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
          <h2 className="text-2xl font-bold text-gray-400">Project Saya</h2>
          <div/>
        </div>
        <ProjectTable
          projects={projects}
          context="client"
          onEdit={undefined as any}
          onDelete={undefined as any}
          onDetail={openDetail}
        />
      </div>
      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={closeDetail} />
      )}
    </AppLayout>
  );
}
