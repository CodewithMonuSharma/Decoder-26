"use client";

import { UniversityTeam } from "@/lib/universityService";
import { Trophy, TrendingUp } from "lucide-react";

interface TeamStatsCardProps {
    teams: UniversityTeam[];
}

export function TeamStatsCard({ teams }: TeamStatsCardProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Top Research Teams</h2>
            </div>

            <div className="space-y-3">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center text-[10px] font-black text-gray-400 bg-white border border-gray-100 rounded-lg">
                                #{team.rank}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{team.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Impact</p>
                                <p className="text-sm font-black text-indigo-600">{team.impactScore}</p>
                            </div>
                            {team.rank <= 3 && (
                                <Trophy className={`w-3.5 h-3.5 ${team.rank === 1 ? "text-amber-500" : team.rank === 2 ? "text-gray-400" : "text-amber-700"
                                    }`} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
