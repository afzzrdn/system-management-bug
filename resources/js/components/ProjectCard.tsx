import React from 'react';

type Status = 'Selesai' | 'Dikerjakan' | 'Ditinjau';

type ProjectCardProps = {
  projectTitle: string;
  taskTitle: string;
  clientName: string; // ganti dari assignee -> clientName
  status?: Status;
};

const ProjectCard = ({
  projectTitle,
  taskTitle,
  clientName,
  status = 'Ditinjau',
}: ProjectCardProps) => {
  const statusStyles: Record<Status, { label: string; style: string }> = {
    Selesai: {
      label: 'Selesai',
      style: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
    },
    Dikerjakan: {
      label: 'Dikerjakan',
      style: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
    },
    Ditinjau: {
      label: 'Ditinjau',
      style: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200',
    },
  };

  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((n) => n[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('');

  return (
    <div className="group w-full max-w-sm cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-full flex-col justify-between gap-4">
        {/* Header */}
        <header className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-500 truncate max-w-[200px]">
            {projectTitle}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status].style}`}
          >
            {statusStyles[status].label}
          </span>
        </header>

        {/* Main */}
        <main>
          <h2 className="text-lg font-bold text-slate-800">{taskTitle}</h2>
        </main>

        {/* Footer - Client Name */}
        <footer className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
              {getInitials(clientName)}
            </div>
            <p className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
              {clientName}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectCard;
