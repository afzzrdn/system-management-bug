import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import FilterDropdown from '@/components/DropDown';
import SearchInput from '@/components/SearchInput';
import UserDetail from '@/components/UserDetail';
import { useTour } from '@/tour/TourProvider'; // ⬅️ NEW

interface PageLink { url: string | null; label: string; active: boolean; }
interface User { id: number; name: string; email: string; phone: string; asal: string; role: 'admin' | 'developer' | 'client'; }
interface PaginatedUsers { data: User[]; links: PageLink[]; from: number; to: number; total: number; }
interface DashboardProps {
  auth: { user: User };
  users: PaginatedUsers;
  filters: { search: string; role: string; };
  flash: { success?: string | null; error?: string | null; };
}
interface PaginationProps { links: PageLink[]; from: number; to: number; total: number; }

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'developer', label: 'Developer' },
  { value: 'client', label: 'Client' },
];

const Pagination: React.FC<PaginationProps> = ({ links, from, to, total }) => {
  const numberClasses = "flex items-center justify-center w-7 h-7 mx-0.5 text-sm font-medium rounded-full";
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-200">
        {links.map((link, key) => {
          const uniqueKey = `${key}-${link.label}`;
          if (key === 0 || key === links.length - 1) {
            return (
              <Link key={uniqueKey} href={link.url || '#'} className={`flex items-center justify-center px-4 h-10 text-sm font-medium ${link.url ? 'text-gray-600 hover:bg-gray-100 rounded-full' : 'text-gray-400 cursor-default'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
            );
          }
          if (link.label === '...') return <span key={uniqueKey} className="flex items-center justify-center px-2 h-10 text-sm text-gray-500">...</span>;
          if (link.active) return <span key={uniqueKey} className={`${numberClasses} bg-indigo-500 text-white z-10`}>{link.label}</span>;
          return <Link key={uniqueKey} href={link.url || '#'} className={`${numberClasses} text-gray-600 hover:bg-gray-100`}>{link.label}</Link>;
        })}
      </div>
      <div className="text-sm text-gray-700">
        Showing <span className="font-semibold text-gray-900">{from}</span> to <span className="font-semibold text-gray-900">{to}</span> of <span className="font-semibold text-gray-900">{total}</span> results
      </div>
    </div>
  );
};

export default function Dashboard({ users, flash, filters }: DashboardProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [role, setRole] = useState(filters.role || '');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { start } = useTour(); // ⬅️ NEW

  const handleRowClick = (user: User) => setSelectedUser(user);

  const handleDelete = (user: User) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna: ${user.name}?`)) {
      router.delete(route('users.destroy', user.id), { preserveScroll: true });
    }
  };

  const reload = useCallback(
    debounce((queryParams: { [key: string]: string }) => {
      router.get(route('users.index'), queryParams, { preserveState: true, preserveScroll: true });
    }, 300), []
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

  const runTour = () => {
    start(
      [
        { element: '[data-tour="search"]',     popover: { title: 'Cari Pengguna', description: 'Ketik nama atau email untuk memfilter daftar.' } },
        { element: '[data-tour="role-filter"]',popover: { title: 'Filter Role', description: 'Tampilkan hanya role tertentu.' } },
        { element: '[data-tour="user-table"]', popover: { title: 'Daftar Pengguna', description: 'Klik baris untuk melihat detail akun.' } },
        { element: '[data-tour="pagination"]', popover: { title: 'Navigasi Halaman', description: 'Pindah halaman bila data banyak.' } },
      ],
      { cursor: false, headerOffsetPx: 64 }
    );
  };

  return (
    <AppLayout>
      <Head><title>Manajemen Pengguna</title></Head>

      <div className="p-8">
        <div className="flex justify-between items-baseline gap-4">
          <h2 className="text-2xl font-semibold text-gray-400">Manajemen Pengguna</h2>
          <div className="flex items-center mb-6 gap-4">
            <button
              onClick={runTour}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
            >
              Tutorial
            </button>

            <div data-tour="search" className="w-full md:flex-grow">
              <SearchInput value={search} onChange={setSearch} placeholder="Cari pengguna..." className="w-full md:flex-grow" />
            </div>

            <div data-tour="role-filter" className="w-full md:w-48">
              <FilterDropdown options={roles} value={role} onChange={setRole} placeholder="Semua Role" widthClassName="w-full md:w-48" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto" data-tour="user-table">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.data.length > 0 ? (
                users.data.map((user, index) => (
                  <tr key={user.id} onClick={() => handleRowClick(user)} className='cursor-pointer'>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{users.from + index}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.asal || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada pengguna yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {users.data.length > 0 && (
          <div data-tour="pagination">
            <Pagination links={users.links} from={users.from} to={users.to} total={users.total} />
          </div>
        )}
      </div>

      {selectedUser && <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </AppLayout>
  );
}
