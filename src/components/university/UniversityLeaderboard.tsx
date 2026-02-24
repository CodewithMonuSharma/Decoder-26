"use client";

import { UniversityStudent } from "@/lib/universityService";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, UserCheck } from "lucide-react";

interface UniversityLeaderboardProps {
    students: UniversityStudent[];
}

export function UniversityLeaderboard({ students }: UniversityLeaderboardProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Student Performance Leaderboard</h2>
                    <p className="text-xs text-gray-500">Ranked by Technical Impact & Authenticity</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Impact</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Authenticity</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Placement Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                            {student.initials}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {student.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-sm font-bold text-gray-700">{student.impactScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-sm font-bold text-gray-700">{student.authenticityScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            student.placementStatus === "Ready"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : student.placementStatus === "Moderate"
                                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                                    : "bg-red-50 text-red-700 border-red-100"
                                        }
                                    >
                                        <UserCheck className="w-3 h-3 mr-1" />
                                        {student.placementStatus}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${student.contributionScore}%` }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
