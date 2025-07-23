// resources/js/layouts/AppLayout.tsx

import { ReactNode, useEffect, useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { Bell, LogOut } from 'lucide-react';
import { Button } from '@headlessui/react';

// Define an interface for the user object for type safety
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AppLayoutProps {
    children: ReactNode;
}

// Nav items hanya dirender sekali
const navItems = [
    { title: 'Dashboard', href: '/{role}/dashboard', roles: ['admin', 'client', 'developer'] },

    { title: 'User', href: '/admin/users', roles: ['admin'] },
    { title: 'Bug', href: '/admin/bugs', roles: ['admin'] },
    { title: 'Project', href: '/admin/project', roles: ['admin'] },

    { title: 'Bug', href: '/developer/bugs', roles: ['developer']},

    { title: 'Project', href: '/client/project', roles: ['client']},
    { title: 'Lapor Bug', href: '/client/bug', roles: ['client']},


];

export default function AppLayout({ children }: AppLayoutProps) {
    const { props } = usePage<{ auth: { user: User | null } }>();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const user = props.auth.user;
    const handleLogout = () => {
        router.post('/logout');
    };
    
    useEffect(() => {
        if (user) {
            fetch('/notifications/unread-count')
                .then(res => res.json())
                .then(data => {
                    setUnreadCount(data.count);
                })
                .catch(() => setUnreadCount(0));
        }
    }, [user]);
    return (
        <div className="min-h-screen text-gray-900">
            {/* Header */}
            <header className="flex items-center px-10 py-4 border-b border-gray-200 justify-between">
                {user && (
                    <div className="flex items-center justify-between w-full">
                        {/* KIRI: Logo */}
                        <div className="w-1/3">
                            <h1 className="text-xl font-bold">BugReport</h1>
                        </div>

                        {/* TENGAH: Nav */}
                        <div className="w-1/3 flex justify-center">
                            <nav>
                                <ul className="flex space-x-4 text-sm font-medium text-gray-600">
                                    {navItems
                                        .filter(item => item.roles.includes(user.role))
                                        .map((item, idx) => {
                                            const href = item.href.replace('{role}', user.role);
                                            return (
                                                <li key={idx}>
                                                    <Link
                                                        href={href}
                                                        className="hover:bg-gray-300 hover:text-black px-3 py-1 rounded-md transition"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </nav>
                        </div>

                        <div className="w-1/3 flex justify-end items-center gap-3">
                            <Link
                                href="/notification"
                                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm hover:bg-gray-200 transition"
                            >
                                <Bell size={16} className="text-gray-700" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                            <Button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm hover:bg-gray-200 transition"
                            >
                                <LogOut size={16} className="text-gray-700" />
                            </Button>
                            <div className="w-[40px] h-[40px] rounded-xl bg-white shadow-sm hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                                {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                            </div>
                            <div className="flex flex-col text-sm leading-tight">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-gray-500 capitalize">{user.role ?? 'Unknown'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="px-5">
                {children}
            </main>
        </div>
    );
}
function setUnreadCount(count: any) {
    throw new Error('Function not implemented.');
}

