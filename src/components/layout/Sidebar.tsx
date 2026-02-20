"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    BarChart2,
    Settings,
    ChevronRight,
    Boxes,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Team", href: "/team", icon: Users },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="h-full w-60 border-r border-border bg-white flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <Boxes className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-[15px] text-gray-900 tracking-tight">CollabSpace</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                                active
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("w-[18px] h-[18px] shrink-0", active ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="w-3.5 h-3.5 text-primary/60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="px-3 pb-4">
                <button
                    onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/auth/login";
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    <span>Logout</span>
                </button>
            </div>

            {/* User profile at bottom */}
            <div className="px-4 py-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-indigo-700">AS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Arjun Sharma</p>
                        <p className="text-xs text-gray-500 truncate">arjun@college.edu</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
