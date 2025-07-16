// resources/js/layouts/AppLayout.tsx
import { ReactNode } from 'react';

type BreadcrumbItem = {
    title: string;
    href: string;
};

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-bold">MyApp</h1>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
                        <ol className="flex space-x-2 text-sm text-gray-600">
                            {breadcrumbs.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                    {idx > 0 && <span className="mx-1">/</span>}
                                    <a href={item.href} className="hover:underline">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
