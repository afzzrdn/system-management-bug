import React, { useState } from 'react';
import { useForm, usePage, router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type Project = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type Bug = {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    project_id: number;
    reported_by: number;
    assigned_to?: number | null;
    resolved_at?: string | null;
    project?: Project;
    reporter?: User;
    assignee?: User;
};

type PageProps = {
    bugs: Bug[];
    projects: Project[];
    users: User[];
};

export default function Bugs() {
    const { bugs, projects, users } = usePage<PageProps>().props;

    const [editingBug, setEditingBug] = useState<Bug | null>(null);

    const form = useForm({
        title: '',
        description: '',
        priority: 'low',
        status: 'open',
        project_id: '',
        reported_by: '',
        assigned_to: '',
        resolved_at: ''
    });

    const isEditing = editingBug !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            form.put(route('bugs.update', editingBug!.id), {
                onSuccess: () => {
                    setEditingBug(null);
                    form.reset();
                },
            });
        } else {
            form.post(route('bugs.store'), {
                onSuccess: () => form.reset()
            });
        }
    };

    const handleEdit = (bug: Bug) => {
        setEditingBug(bug);
        form.setData({
            title: bug.title,
            description: bug.description,
            priority: bug.priority,
            status: bug.status,
            project_id: String(bug.project_id),
            reported_by: String(bug.reported_by),
            assigned_to: bug.assigned_to ? String(bug.assigned_to) : '',
            resolved_at: bug.resolved_at ?? ''
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus bug ini?')) {
            router.delete(route('bugs.destroy', id));
        }
    };

    return (
        
        <AppLayout>
            <div className="p-8 ">
            <Head>
                <title>Manajemen Bug</title>
            </Head>

            {/* Form Tambah/Edit */}
            <div className="bg-white p-6 shadow rounded-md border">
                <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Bug' : 'Tambah Bug'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Judul" value={form.data.title} onChange={e => form.setData('title', e.target.value)} className="w-full border rounded px-3 py-2" />
                    <textarea placeholder="Deskripsi" value={form.data.description} onChange={e => form.setData('description', e.target.value)} className="w-full border rounded px-3 py-2" />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <select value={form.data.priority} onChange={e => form.setData('priority', e.target.value)} className="border rounded px-3 py-2">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>

                        <select value={form.data.status} onChange={e => form.setData('status', e.target.value)} className="border rounded px-3 py-2">
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>

                        <select value={form.data.project_id} onChange={e => form.setData('project_id', e.target.value)} className="border rounded px-3 py-2">
                            <option value="">Pilih Proyek</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>

                        <select value={form.data.reported_by} onChange={e => form.setData('reported_by', e.target.value)} className="border rounded px-3 py-2">
                            <option value="">Dilaporkan oleh</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>

                        <select value={form.data.assigned_to} onChange={e => form.setData('assigned_to', e.target.value)} className="border rounded px-3 py-2">
                            <option value="">Ditugaskan ke</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>

                        <input type="date" value={form.data.resolved_at || ''} onChange={e => form.setData('resolved_at', e.target.value)} className="border rounded px-3 py-2" />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            {isEditing ? 'Update' : 'Simpan'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setEditingBug(null); form.reset(); }} className="bg-gray-400 text-white px-4 py-2 rounded">
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabel Bug */}
            <div className="overflow-auto">
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Judul</th>
                            <th className="border px-4 py-2">Prioritas</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Proyek</th>
                            <th className="border px-4 py-2">Reporter</th>
                            <th className="border px-4 py-2">Assignee</th>
                            <th className="border px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bugs.map(bug => (
                            <tr key={bug.id}>
                                <td className="border px-4 py-2">{bug.title}</td>
                                <td className="border px-4 py-2 capitalize">{bug.priority}</td>
                                <td className="border px-4 py-2 capitalize">{bug.status}</td>
                                <td className="border px-4 py-2">{bug.project?.name}</td>
                                <td className="border px-4 py-2">{bug.reporter?.name}</td>
                                <td className="border px-4 py-2">{bug.assignee?.name || '-'}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button onClick={() => handleEdit(bug)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(bug.id)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </AppLayout>
    );
}
