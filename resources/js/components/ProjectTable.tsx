import { Pencil, Trash2, User } from 'lucide-react';

type Project = {
  id: number;
  name: string;
  description: string | null;
  client_id: number;
  client?: { id: number; name: string };
  bugs_count?: number;
};

interface Props {
  projects: Project[];
  context: 'client' | 'admin';
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onDetail: (project: Project) => void;
}

export default function ProjectCardGrid({ projects, context, onEdit, onDelete, onDetail }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-700">Belum Ada Proyek</h3>
        <p className="text-gray-500 mt-2">Silakan tambahkan proyek baru untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group border border-gray-200"
          onClick={() => onDetail(project)}
        >
          <div className="p-6 flex-grow">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 truncate">
              {project.name}
            </h3>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <User size={16} className="mr-2 flex-shrink-0" />
              {context === 'client' ? (
                <span className="truncate">Aku</span>
              ) : (
                <span className="truncate">{project.client?.name ?? '-'}</span>
              )}
            </div>
          </div>

          {context === 'admin' && (
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3 flex justify-end items-center space-x-3">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                className="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                title="Edit Project"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
