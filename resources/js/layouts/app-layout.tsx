import { ReactNode, useEffect, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
// UPDATED: Imported ChevronsLeft for the toggle button
import { Bell, LogOut, MessageSquare, LayoutDashboard, Users, Bug, Folder, ChevronsLeft } from "lucide-react";

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
    { title: "Dashboard", href: "/{role}/dashboard", icon: LayoutDashboard, roles: ["admin", "client", "developer"] },
    { title: "User", href: "/admin/users", icon: Users, roles: ["admin"] },
    { title: "Bug", href: "/admin/bugs", icon: Bug, roles: ["admin"] },
    { title: "Project", href: "/admin/project", icon: Folder, roles: ["admin"] },
    { title: "Bug", href: "/developer/bugs", icon: Bug, roles: ["developer"] },
    { title: "Project", href: "/client/project", icon: Folder, roles: ["client"] },
    { title: "Bug", href: "/client/bugs", icon: Bug, roles: ["client"] },
];

export default function AppLayout({ children }: AppLayoutProps) {
    const { props } = usePage<{ auth: { user: User | null } }>();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const user = props.auth.user;

    const handleLogout = () => {
        router.post("/logout");
    };
    
    // ADDED: Function to toggle the sidebar state
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    useEffect(() => {
        if (user) {
            fetch("/notifications/unread-count")
                .then((res) => res.json())
                .then((data) => setUnreadCount(data.count))
                .catch(() => setUnreadCount(0));
        }
    }, [user]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            {/* UPDATED: Added conditional width and transition classes */}
            <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
                
                {/* ADDED: Sidebar toggle button */}
                <div className={`p-4 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
                    <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
                        <ChevronsLeft 
                            size={18}
                            className={`transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} 
                        />
                    </button>
                </div>

                {user && (
                    <div className="flex-1 overflow-y-auto">
                        <nav className="mt-4">
                            <ul className="space-y-1">
                                {navItems
                                    .filter((item) => item.roles.includes(user.role))
                                    .map((item, idx) => {
                                        const href = item.href.replace("{role}", user.role);
                                        const Icon = item.icon;
                                        return (
                                            <li key={idx} className="px-2"> {/* Added padding for better spacing */}
                                                <Link
                                                    href={href}
                                                    // UPDATED: Conditional classes for collapsed/expanded state
                                                    className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                                >
                                                    <Icon size={18} />
                                                    {/* UPDATED: Hide text when sidebar is collapsed */}
                                                    {!isSidebarCollapsed && <span>{item.title}</span>}
                                                </Link>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </nav>
                    </div>
                )}

                {/* Footer User Info */}
                {user && (
                    <div className="border-t border-gray-200 p-4">
                        {/* UPDATED: Layout changes based on sidebar state */}
                        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 flex-shrink-0">
                                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                            </div>
                            {/* UPDATED: Hide user name/role when collapsed */}
                            {!isSidebarCollapsed && (
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                                </div>
                            )}
                        </div>
                        <div className={`mt-3 flex gap-2 ${isSidebarCollapsed ? 'flex-col items-center' : ''}`}>
                            <Link
                                href="/notification"
                                className="relative p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                            >
                                <Bell size={16} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}