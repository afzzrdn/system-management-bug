import { Pencil, Trash2 } from 'lucide-react';

type Project = {
    id: number;
    name: string;
    description: string | null;
    client_id: number;
    client?: { id: number; name: string };
};

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onDetail: (project: Project) => void;
}

export default function ProjectTable({ projects, onEdit, onDelete, onDetail }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">No</th>
            <th className="px-6 py-3">Nama Project</th>
            <th className="px-6 py-3">Client</th>
            <th className="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.length > 0 ? projects.map((project, index) => (
            <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDetail(project)}>
              <td className="px-6 py-4 text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 text-gray-900">{project.name}</td>
              <td className="px-6 py-4 text-gray-500">{project.client?.name ?? 'N/A'}</td>
              <td className="px-6 py-4 space-x-4">
                <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="text-indigo-600 hover:text-indigo-900">
                  <Pencil size={18} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(project); }} className="text-red-600 hover:text-red-900">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center p-8 text-gray-500">Belum ada project.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
