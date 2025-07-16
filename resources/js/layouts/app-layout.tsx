// resources/js/layouts/AppLayout.tsx
import { ReactNode } from 'react';
import { usePage, Link } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
}

const navItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User', href: '/user' } 
];

export default function AppLayout({ children }: AppLayoutProps) {
    const { url } = usePage();

    const showNav = url !== '/' && !url.startsWith('/login');

    return (
        <div className="min-h-screen text-gray-900">
            {/* Header */}
            <header className="flex justify-start items-center py-4">
                <div className="max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-bold">BugReport</h1>
                </div>

                {/* Menu Navigasi Utama */}
                {showNav && (
                    <nav className="border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
                            <ol className="flex space-x-6 text-md text-gray-400 font-semibold">
                                {navItems.map((item, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <Link href={item.href} className="hover:bg-gray-300 hover:text-black px-5 py-2 rounded-lg">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </nav>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-screen px-5">
                {children}
            </main>
        </div>
    );
}