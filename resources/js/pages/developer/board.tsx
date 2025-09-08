import React, { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { PlayCircle, Search, Filter, RefreshCcw } from 'lucide-react';
import { useTour } from '@/tour/TourProvider';

type Bug = {
  id: number | string;
  title: string;
  status: 'open'|'in_progress'|'resolved';
  priority: 'low'|'medium'|'high'|'critical';
  project?: { id:number; name:string };
};

type PageProps = { bugs: Bug[] };

const COLUMNS: {key: Bug['status']; title: string; color: string}[] = [
  { key: 'open',         title: 'Open',        color: 'text-sky-600 bg-sky-50 ring-sky-200' },
  { key: 'in_progress',  title: 'In Progress', color: 'text-amber-600 bg-amber-50 ring-amber-200' },
  { key: 'resolved',     title: 'Resolved',    color: 'text-emerald-600 bg-emerald-50 ring-emerald-200' },
];

const PRIORITY_BADGE: Record<Bug['priority'], string> = {
  low:'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  medium:'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100',
  high:'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
  critical:'bg-red-50 text-red-700 ring-1 ring-red-100',
};

export default function DevBoard() {
  const { bugs: initial } = usePage<PageProps>().props;

  const [items, setItems] = useState(initial);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Bug['status'] | null>(null);

  // filter & search
  const [q, setQ] = useState('');
  const [prio, setPrio] = useState<'' | Bug['priority']>('');
  const { start } = useTour();

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();
    return items.filter(b => {
      if (prio && b.priority !== prio) return false;
      if (!search) return true;
      return (b.title?.toLowerCase().includes(search) || (b.project?.name ?? '').toLowerCase().includes(search));
    });
  }, [items, q, prio]);

  const lanes = useMemo(() => {
    const map: Record<Bug['status'], Bug[]> = { open:[], in_progress:[], resolved:[] };
    filtered.forEach(b => map[b.status].push(b));
    return map;
  }, [filtered]);

  // drag helpers
  const onDragStart = (ev: React.DragEvent, bugId: string|number) => {
    ev.dataTransfer.setData('text/plain', String(bugId));
    ev.dataTransfer.effectAllowed = 'move';
    setDraggingId(String(bugId));
  };
  const onDragEnd = () => {
    setDraggingId(null);
    setOverCol(null);
  };
  const onDragOver = (ev: React.DragEvent, col: Bug['status']) => {
    ev.preventDefault();
    setOverCol(col);
  };
  const onDrop = async (ev: React.DragEvent, status: Bug['status']) => {
    ev.preventDefault();
    const id = ev.dataTransfer.getData('text/plain');
    setOverCol(null);
    if (!id) return;

    const idx = items.findIndex(b => String(b.id) === id);
    if (idx < 0 || items[idx].status === status) return;

    const prev = items[idx];
    // Optimistic update
    setItems(list => {
      const next = [...list];
      next[idx] = { ...prev, status };
      return next;
    });

    try {
      await axios.post(`/developer/bugs/${id}/move`, { status });
    } catch {
      // rollback kalau gagal
      setItems(list => {
        const next = [...list];
        const i = next.findIndex(b => String(b.id) === id);
        if (i >= 0) next[i] = { ...next[i], status: prev.status };
        return next;
      });
      alert('Gagal memindahkan bug.');
    } finally {
      setDraggingId(null);
    }
  };

  const resetFilter = () => { setQ(''); setPrio(''); };

  const runTour = () => {
    start(
      [
        {
          element: '#board-toolbar',
          popover: {
            title: 'Filter & Pencarian',
            description: 'Gunakan pencarian judul/proyek dan filter prioritas untuk fokus pada item yang relevan.',
          },
        },
        {
          element: '#board-columns',
          popover: {
            title: 'Kolom Status',
            description: 'Tarik kartu dari satu kolom ke kolom lain untuk mengubah status bug secara cepat (drag & drop).',
          },
        },
        {
          element: '#board-card-sample',
          popover: {
            title: 'Kartu Bug',
            description: 'Setiap kartu menunjukkan judul, prioritas, dan proyek. Pegang kartu untuk memindahkan.',
          },
        },
      ],
      { cursor: false }
    );
  };

  return (
    <AppLayout>
      <Head title="Board" />
      <div className="p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-400">Kanban Board</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={runTour}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50"
            >
              <PlayCircle className="h-4 w-4" />
              Tutorial
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div id="board-toolbar" className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari judul atau proyek…"
                className="w-72 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={prio}
                onChange={(e) => setPrio(e.target.value as any)}
                className="w-48 appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-indigo-300"
              >
                <option value="">Semua Prioritas</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {(q || prio) && (
              <button
                onClick={resetFilter}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-gray-50"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* total counter */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {COLUMNS.map(c => (
              <span key={c.key} className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${c.color}`}>
                {c.title}: <b className="text-slate-900">{lanes[c.key].length}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div id="board-columns" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map(col => {
            const isOver = overCol === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => onDragOver(e, col.key)}
                onDrop={(e) => onDrop(e, col.key)}
                className={[
                  'relative rounded-2xl border bg-white p-3 transition',
                  isOver ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-gray-200',
                  'min-h-[64vh]',
                ].join(' ')}
              >
                {/* column header */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">{col.title}</h3>
                  <span className="text-xs text-slate-500">{lanes[col.key].length}</span>
                </div>

                {/* drop overlay animation */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity ${
                    isOver ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    boxShadow: isOver ? 'inset 0 0 0 2px rgba(99,102,241,0.35), inset 0 0 0 6px rgba(99,102,241,0.08)' : undefined,
                  }}
                />

                <div className="space-y-3">
                  {lanes[col.key].map((b, idx) => (
                    <div
                      id={idx === 0 && col.key === COLUMNS[0].key ? 'board-card-sample' : undefined}
                      key={b.id}
                      draggable
                      onDragStart={(e)=>onDragStart(e, b.id)}
                      onDragEnd={onDragEnd}
                      className={[
                        'rounded-xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                        draggingId === String(b.id) ? 'opacity-60 border-indigo-200' : 'border-gray-200',
                        'cursor-grab active:cursor-grabbing',
                      ].join(' ')}
                    >
                      <div className="mb-2 text-sm font-semibold leading-6 text-slate-900">
                        {b.title}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] px-2 py-0.5 rounded ${PRIORITY_BADGE[b.priority]}`}>
                          {b.priority}
                        </span>
                        <span className="text-[11px] text-slate-500">{b.project?.name ?? '-'}</span>
                      </div>
                    </div>
                  ))}

                  {!lanes[col.key].length && (
                    <div
                      className={[
                        'rounded-lg border border-dashed p-4 text-center text-xs text-slate-500 transition',
                        isOver ? 'border-indigo-300 bg-indigo-50/40 text-indigo-600' : 'border-gray-200',
                      ].join(' ')}
                    >
                      {isOver ? 'Lepas untuk memindahkan ke sini' : 'Drop item di sini'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
