"use client";

import { useEffect, useState } from "react";
import { Github, Zap, TrendingUp, GitCommitHorizontal, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Stats {
    totalCommits: number;
    totalImpactScore: number;
    averageImpactScore: number;
    highImpactCount: number;
    highestImpactCommit: { message: string; impactScore: number; author: string } | null;
    recentHighImpact: { message: string; impactScore: number; author: string } | null;
}

export default function GitHubImpactCard({ teamId = "demo" }: { teamId?: string }) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/github/stats?teamId=${teamId}`)
            .then((r) => r.json())
            .then((d) => setStats(d))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, [teamId]);

    if (loading) {
        return (
            <div className="bg-white border border-border rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (!stats || stats.totalCommits === 0) {
        return (
            <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                        <Github className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">GitHub Impact</h3>
                        <p className="text-xs text-gray-400">Connect a repo in the Team tab</p>
                    </div>
                </div>
                <div className="py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400">No commits yet. Go to <Link href="/team" className="text-teal-600 font-semibold hover:underline">Team → GitHub</Link> to connect.</p>
                </div>
            </div>
        );
    }

    const statItems = [
        {
            label: "Total Impact",
            value: stats.totalImpactScore.toLocaleString(),
            icon: Zap,
            color: "text-violet-600",
            bg: "bg-violet-50",
        },
        {
            label: "Avg Score",
            value: `${stats.averageImpactScore}/100`,
            icon: TrendingUp,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            label: "High Impact",
            value: `${stats.highImpactCount} commits`,
            icon: GitCommitHorizontal,
            color: "text-red-500",
            bg: "bg-red-50",
        },
    ];

    return (
        <div className="bg-white border border-border rounded-xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                        <Github className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">GitHub Impact</h3>
                        <p className="text-xs text-gray-400">{stats.totalCommits} commits analyzed</p>
                    </div>
                </div>
                <Link href="/analytics" className="flex items-center gap-1 text-xs text-teal-600 hover:underline font-medium">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {statItems.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center mx-auto mb-1.5`}>
                            <Icon className={`w-3.5 h-3.5 ${color}`} />
                        </div>
                        <p className="text-sm font-extrabold text-gray-900 leading-tight">{value}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Highest Impact Commit */}
            {stats.highestImpactCommit && (
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl px-4 py-3">
                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-1">🏆 Highest Impact</p>
                    <p className="text-xs font-semibold text-gray-900 truncate">{stats.highestImpactCommit.message}</p>
                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-gray-400">{stats.highestImpactCommit.author}</span>
                        <span className="text-xs font-extrabold text-violet-600">{stats.highestImpactCommit.impactScore}/100</span>
                    </div>
                </div>
            )}
        </div>
    );
}
