"use client";

import { useEffect, useState, useCallback } from "react";
import { GitCommitHorizontal, Loader2, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Commit {
    _id: string;
    commitId: string;
    author: string;
    authorAvatar?: string;
    message: string;
    filesChanged: number;
    additions: number;
    deletions: number;
    timestamp: string;
    url: string;
    impactScore: number;
    impactLevel: "Low" | "Medium" | "High";
    impactInsight: string;
}

interface CommitListProps {
    teamId: string;
    refreshTrigger?: number;
}

const LEVEL_STYLES = {
    High: "bg-red-50 text-red-600 border-red-100",
    Medium: "bg-amber-50 text-amber-600 border-amber-100",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const SCORE_BAR_COLOR = {
    High: "bg-red-400",
    Medium: "bg-amber-400",
    Low: "bg-emerald-400",
};

export default function CommitList({ teamId, refreshTrigger }: CommitListProps) {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/github/commits?teamId=${teamId}`);
            const data = await res.json();
            setCommits(Array.isArray(data.commits) ? data.commits : []);
        } catch {
            setCommits([]);
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => { load(); }, [load, refreshTrigger]);

    if (loading) {
        return (
            <div className="space-y-3 mt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (commits.length === 0) {
        return (
            <div className="mt-6 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <GitCommitHorizontal className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No commits synced yet.</p>
                <p className="text-xs text-gray-300 mt-1">Connect a repo and click "Sync Commits".</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900">Recent Commits</h4>
                <span className="text-xs text-gray-400">{commits.length} commits</span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Commit</th>
                            <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th>
                            <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Score</th>
                            <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Level</th>
                            <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {commits.map((c) => (
                            <tr key={c._id} className="hover:bg-gray-50/60 transition-colors group">
                                <td className="px-4 py-3 max-w-xs">
                                    <div className="flex items-start gap-2">
                                        <GitCommitHorizontal className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900 truncate max-w-[220px]">{c.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                +{c.additions} / -{c.deletions} · {c.filesChanged} files
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                                            <User className="w-3 h-3 text-teal-600" />
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">{c.author}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-sm font-extrabold text-gray-900">{c.impactScore}</span>
                                        <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${SCORE_BAR_COLOR[c.impactLevel]}`}
                                                style={{ width: `${c.impactScore}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${LEVEL_STYLES[c.impactLevel]}`}>
                                        {c.impactLevel}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400">
                                    {new Date(c.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                </td>
                                <td className="px-4 py-3">
                                    {c.url && c.url !== "#" && (
                                        <a href={c.url} target="_blank" rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden space-y-3">
                {commits.map((c) => (
                    <div key={c._id} className="bg-white border border-gray-100 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-gray-900 flex-1">{c.message}</p>
                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${LEVEL_STYLES[c.impactLevel]}`}>
                                {c.impactLevel}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-gray-400">{c.author} · {new Date(c.timestamp).toLocaleDateString()}</span>
                            <span className="text-sm font-extrabold text-gray-900">{c.impactScore}<span className="text-[10px] text-gray-400 font-normal">/100</span></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
