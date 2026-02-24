"use client";

import { Users, UserCheck, Zap, BarChart3 } from "lucide-react";

interface PerformanceOverviewProps {
    stats: {
        totalStudents: number;
        placementReady: number;
        avgImpact: number;
    };
}

export function PerformanceOverview({ stats }: PerformanceOverviewProps) {
    const cards = [
        {
            label: "Total Students",
            value: stats.totalStudents.toLocaleString(),
            icon: Users,
            bg: "bg-indigo-50",
            color: "text-indigo-600",
            sub: "Active in projects"
        },
        {
            label: "Placement Ready",
            value: stats.placementReady.toLocaleString(),
            icon: UserCheck,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            sub: "Top 37.5% contributors"
        },
        {
            label: "Avg. Impact Score",
            value: `${stats.avgImpact}%`,
            icon: Zap,
            bg: "bg-amber-50",
            color: "text-amber-600",
            sub: "University aggregate"
        },
        {
            label: "Academic Alignment",
            value: "92%",
            icon: BarChart3,
            bg: "bg-purple-50",
            color: "text-purple-600",
            sub: "Milestone completion"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">Live Data</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{card.value}</p>
                        <p className="text-sm font-bold text-gray-700 mt-1">{card.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                    </div>
                );
            })}
        </div>
    );
}
