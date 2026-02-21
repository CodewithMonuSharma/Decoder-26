"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Github, TrendingUp, Zap, AlertTriangle, GitCommitHorizontal } from "lucide-react";

interface Commit {
    _id: string;
    message: string;
    author: string;
    impactScore: number;
    impactLevel: "Low" | "Medium" | "High";
    impactInsight: string;
    timestamp: string;
    additions: number;
    deletions: number;
    filesChanged: number;
}

const LEVEL_STYLES = {
    High: "bg-red-50 text-red-600 border-red-100",
    Medium: "bg-amber-50 text-amber-600 border-amber-100",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 max-w-xs">
                <p className="text-[10px] text-gray-400 mb-1 truncate">{d.message}</p>
                <p className="text-sm font-bold text-indigo-600">{payload[0].value} / 100</p>
                <p className="text-[10px] text-gray-400">{d.level}</p>
            </div>
        );
    }
    return null;
};

export default function CommitImpactAnalytics({ teamId = "demo" }: { teamId?: string }) {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/github/commits?teamId=${teamId}`)
            .then((r) => r.json())
            .then((d) => setCommits(Array.isArray(d.commits) ? d.commits : []))
            .catch(() => setCommits([]))
            .finally(() => setLoading(false));
    }, [teamId]);

    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-100 rounded w-1/4 mb-6" />
                <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
        );
    }

    if (commits.length === 0) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                        <Github className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Commit Impact Analytics</h3>
                        <p className="text-xs text-gray-400">AI-powered GitHub commit scoring</p>
                    </div>
                </div>
                <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Github className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-medium">No commits synced</p>
                    <p className="text-xs text-gray-300 mt-1">Go to Team → GitHub tab to connect a repo and sync commits.</p>
                </div>
            </div>
        );
    }

    // Reverse for chronological order in chart
    const chartData = [...commits]
        .reverse()
        .slice(-15)
        .map((c) => ({
            message: c.message.length > 25 ? c.message.slice(0, 25) + "…" : c.message,
            score: c.impactScore,
            level: c.impactLevel,
            date: new Date(c.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        }));

    const avgScore = Math.round(commits.reduce((s, c) => s + c.impactScore, 0) / commits.length);
    const highCount = commits.filter((c) => c.impactLevel === "High").length;
    const medCount = commits.filter((c) => c.impactLevel === "Medium").length;
    const recentCommits = commits.slice(0, 8);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                    <Github className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Commit Impact Analytics</h3>
                    <p className="text-xs text-gray-400">AI-powered GitHub commit scoring · {commits.length} commits</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-violet-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-violet-600" />
                        <span className="text-xs font-semibold text-violet-600">Avg Score</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-900">{avgScore}<span className="text-sm text-gray-400 font-normal">/100</span></p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-semibold text-red-500">High Impact</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-900">{highCount}<span className="text-sm text-gray-400 font-normal"> commits</span></p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-500">Medium</span>
                    </div>
                    <p className="text-2xl font-extrabold text-gray-900">{medCount}<span className="text-sm text-gray-400 font-normal"> commits</span></p>
                </div>
            </div>

            {/* Impact Score Trend Chart */}
            <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Impact Score Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            width={28}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={65} stroke="#ef444430" strokeDasharray="4 4" label={{ value: "High", fill: "#ef4444", fontSize: 10, position: "right" }} />
                        <ReferenceLine y={35} stroke="#f59e0b30" strokeDasharray="4 4" label={{ value: "Med", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: "#6366f1" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Commits Table */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Commits</h4>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Commit Message</th>
                                <th className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Author</th>
                                <th className="text-center px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
                                <th className="text-center px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Level</th>
                                <th className="text-left px-3 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {recentCommits.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors" title={c.impactInsight}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <GitCommitHorizontal className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                            <span className="font-medium text-gray-800 truncate max-w-[180px]">{c.message}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-gray-500 hidden sm:table-cell">{c.author}</td>
                                    <td className="px-3 py-3 text-center">
                                        <span className="font-extrabold text-gray-900">{c.impactScore}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${LEVEL_STYLES[c.impactLevel]}`}>
                                            {c.impactLevel}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-gray-400 hidden md:table-cell">
                                        {new Date(c.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
