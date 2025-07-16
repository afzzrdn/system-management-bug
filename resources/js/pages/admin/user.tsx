import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

interface PageLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'developer' | 'client';
}

interface PaginatedUsers {
    data: User[];
    links: PageLink[];
    from: number;
}

interface DashboardProps {
    auth: {
        user: User;
    };
    users: PaginatedUsers;
    flash: {
        success?: string | null;
    };
}

interface PaginationProps {
    links: PageLink[];
}


const Pagination: React.FC<PaginationProps> = ({ links }) => {
    return (
        <div className="flex flex-wrap -mb-1 mt-6">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <div
                            key={key}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-white' : ''}`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
};

export default function Dashboard({users, flash }: DashboardProps) {
    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete user: ${user.name}?`)) {
            router.delete(route('users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>User Management</title>
            </Head>

            <div className="p-4 md:p-6">
                {/* Header Dashboard */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                     <h2 className="text-2xl font-semibold text-gray-400">Dashboard</h2>
                </div>

                {/* Flash Message/Notification */}
                {flash.success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
                        {flash.success}
                    </div>
                )}

                {/* Tabel Pengguna */}
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{users.from + index}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Komponen Paginasi */}
                {users.data.length > 0 && <Pagination links={users.links} />}
            </div>
        </AppLayout>
    );
}