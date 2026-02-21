"use client";

import { Trophy, Medal, Award } from "lucide-react";
import { LeaderboardEntry } from "@/lib/transcriptService";

interface LeaderboardProps {
    entries: LeaderboardEntry[];
}

const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-amber-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-700" />;
    return <span className="text-xs font-bold text-gray-400">#{rank}</span>;
};

export function Leaderboard({ entries }: LeaderboardProps) {
    if (entries.length === 0) return null;

    const max = entries[0]?.contributionScore ?? 100;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900">Team Leaderboard</h2>
                    <p className="text-[11px] text-gray-400">Ranked by Contribution Score</p>
                </div>
            </div>

            <div className="space-y-3">
                {entries.map((entry) => (
                    <div
                        key={entry.rank}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${entry.rank === 1
                                ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100"
                                : "bg-gray-50 border-gray-100"
                            }`}
                    >
                        {/* Rank */}
                        <div className="w-7 flex items-center justify-center flex-shrink-0">
                            <RankIcon rank={entry.rank} />
                        </div>

                        {/* Avatar */}
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
                            style={{ backgroundColor: entry.color }}
                        >
                            {entry.initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{entry.name}</p>
                            <p className="text-[11px] text-gray-400">{entry.role} · {entry.commits} commits</p>
                        </div>

                        {/* Score bar */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${(entry.contributionScore / max) * 100}%`,
                                        backgroundColor: entry.color,
                                    }}
                                />
                            </div>
                            <span className="text-sm font-bold text-gray-800 w-8 text-right">
                                {entry.contributionScore}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
