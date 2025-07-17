// resources/js/layouts/AppLayout.tsx

import { ReactNode } from 'react';
import { usePage, Link } from '@inertiajs/react';

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

const navItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User', href: '/user' }
];

export default function AppLayout({ children }: AppLayoutProps) {
    const { props } = usePage<{ auth: { user: User } }>();
    const user = props.auth.user;

    return (
        <div className="min-h-screen text-gray-900">
            {/* Header */}
            <header className="flex justify-between px-10 items-center py-4">
                <div className="max-w-7xl py-4">
                    <h1 className="text-xl font-bold">BugReport</h1>
                </div>

                {/* Show navigation only if user is logged in */}
                {user && (
                    <nav className="border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
                            <ol className="flex space-x-2 text-md text-gray-400 font-semibold">
                                {navItems.map((item, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <Link href={item.href} className="hover:bg-gray-300 hover:text-black px-3 py-1 rounded-lg">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </nav>
                )}

                    <div className='flex items-center gap-3'>
                        <div className='w-[40px] h-[40px] rounded-xl bg-gray-300 flex items-center justify-center font-bold'>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex flex-col text-sm'>
                            <p className='font-semibold'>{user.name}</p>
                            <p className='text-gray-500'>{user.role}</p>
                        </div>
                    </div>
            </header>

            {/* Main Content */}
            <main className="max-w-screen px-5">
                {children}
            </main>
        </div>
    );
}