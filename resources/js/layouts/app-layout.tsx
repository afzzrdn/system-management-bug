import { ReactNode, useEffect, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { Bell, LogOut, LayoutDashboard, Users, Bug, File, Folder, ChevronsLeft, ShieldCheck } from "lucide-react";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    asal: string;
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
    { title: "Board", href: "/developer/board", icon: File, roles: ["developer"] },
];

export default function AppLayout({ children }: AppLayoutProps) {
    const { props } = usePage<{ auth: { user: User | null } }>();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const user = props.auth.user;

    const handleLogout = () => {
        router.post("/logout");
    };

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
        <div className="flex bg-gray-100 min-h-screen">
            <aside className={`bg-white border-r fixed h-screen border-gray-200 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>

                <div className="p-4 border-b border-gray-200 flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                       <ShieldCheck size={24}/>
                    </div>
                </div>

                {user && (
                    <div className="flex-1 overflow-y-auto">
                        <nav className="p-2 mt-2">
                            <ul className="space-y-1">
                                {navItems
                                    .filter((item) => item.roles.includes(user.role))
                                    .map((item, idx) => {
                                        const href = item.href.replace("{role}", user.role);
                                        const Icon = item.icon;
                                        return (
                                            <li key={idx}>
                                                <Link
                                                    href={href}
                                                    className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-md transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                                >
                                                    <Icon size={18} className="flex-shrink-0" />
                                                    {!isSidebarCollapsed && <span className="truncate">{item.title}</span>}
                                                </Link>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </nav>
                    </div>
                )}

                <div className="p-4 border-t border-gray-200">
                    <button onClick={toggleSidebar} className="w-full flex items-center justify-center p-2 rounded-md hover:bg-gray-100 text-gray-600">
                        <ChevronsLeft
                            size={18}
                            className={`transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {/* Footer User Info */}
                {user && (
                    <div className="border-t border-gray-200 p-4">
                        <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-4' : 'flex-row gap-3'}`}>

                            <Link href="/profile" className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : 'flex-1'} hover:bg-gray-100 p-2 rounded-md transition-colors`}>
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 flex-shrink-0">
                                    {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                                </div>
                                {!isSidebarCollapsed && (
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                        <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                                    </div>
                                )}
                            </Link>

                            {/* FIXED: Added conditional flex-col class */}
                            <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
                                <Link
                                    href="/notification"
                                    className="relative p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
                {children}
            </main>
        </div>
    );
}
