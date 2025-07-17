// resources/js/Pages/Dashboard.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import FilterDropdown from '@/components/DropDown';
import SearchInput from '@/components/SearchInput';

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
    filters: {
        search: string;
        role: string;
    };
    flash: {
        success?: string | null;
        error?: string | null;
    };
}

interface PaginationProps {
    links: PageLink[];
}

const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'developer', label: 'Developer' },
    { value: 'client', label: 'Client' },
];

const Pagination: React.FC<PaginationProps> = ({ links }) => {
    return (
        <div className="flex flex-wrap -mb-1 mt-6">
            {links.map((link, key) => {
                if (link.url === null) {
                    return (
                        <div
                            key={key}
                            className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded cursor-default"
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

export default function Dashboard({ users, flash, filters }: DashboardProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || ''); 

    const handleDelete = (user: User) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengguna: ${user.name}?`)) {
            router.delete(route('users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    const reload = useCallback(
        debounce((queryParams: { [key: string]: string }) => {
            router.get(route('users.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        const queryParams: { [key: string]: string } = {};
        if (search) queryParams.search = search;
        if (role) queryParams.role = role;
        
        reload(queryParams);
    }, [search, role, reload]);
    
    const getRoleBadgeClass = (userRole: string) => {
        switch (userRole) {
            case 'admin': return 'bg-indigo-100 text-indigo-800';
            case 'developer': return 'bg-red-100 text-red-800';
            case 'client': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>Manajemen Pengguna</title>
            </Head>

            <div className="p-4 md:p-6">
                <div className="flex justify-between items-baseline gap-4">
                    <h2 className="text-2xl font-semibold text-gray-400">Manajemen Pengguna</h2>
                    <div className="flex items-center  mb-6 gap-4">
                      <SearchInput
                          value={search}
                          onChange={setSearch}
                          placeholder="Cari pengguna..."
                          className="w-full  md:flex-grow"
                      />
                      <FilterDropdown
                          options={roles}
                          value={role}           
                          onChange={setRole}    
                          placeholder="Semua Role"
                          widthClassName="w-full md:w-48"
                      />
                  </div>
                </div>

                {flash.success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                   <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran</th>
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
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Tidak ada pengguna yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {users.data.length > 0 && <Pagination links={users.links} />}
            </div>
        </AppLayout>
    );
}