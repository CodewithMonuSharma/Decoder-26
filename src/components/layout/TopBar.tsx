"use client";

import Link from "next/link";
import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopBar({ title }: { title?: string }) {
    return (
        <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                {title && (
                    <h1 className="text-[15px] font-semibold text-gray-900">{title}</h1>
                )}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-8 w-52 pl-8 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-500 relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </Button>
                <Link href="/projects/new">
                    <Button size="sm" className="h-8 gap-1.5 text-xs">
                        <Plus className="w-3.5 h-3.5" />
                        New Project
                    </Button>
                </Link>
            </div>
        </header>
    );
}
