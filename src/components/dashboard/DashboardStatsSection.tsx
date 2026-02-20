"use client";

import { useEffect, useState } from "react";
import { FolderKanban, CheckCircle2, Users, TrendingUp } from "lucide-react";

export function DashboardStatsSection() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/projects")
            .then((r) => r.json())
            .then((data) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const totalTasks = projects.flatMap((p) => p.tasks ?? []).length;
    const doneTasks = projects.flatMap((p) => p.tasks ?? []).filter((t: any) => t.status === "done").length;
    const uniqueMembers = new Set(projects.flatMap((p) => (p.members ?? []).map((m: any) => m.email))).size;
    const avgProgress =
        projects.length > 0
            ? Math.round(projects.reduce((sum, p) => sum + (p.progress ?? 0), 0) / projects.length)
            : 0;

    const stats = [
        { label: "Active Projects", value: loading ? "..." : String(projects.length), icon: FolderKanban, change: "From database", color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Tasks Completed", value: loading ? "..." : String(doneTasks), icon: CheckCircle2, change: `of ${totalTasks} total tasks`, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Team Members", value: loading ? "..." : String(uniqueMembers), icon: Users, change: "Across all projects", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Avg. Progress", value: loading ? "..." : `${avgProgress}%`, icon: TrendingUp, change: "Live from Atlas", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.label} className="bg-white border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.change}</p>
                    </div>
                );
            })}
        </div>
    );
}
