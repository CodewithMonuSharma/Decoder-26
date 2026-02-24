"use client";

import { UniversityStudent } from "@/lib/universityService";
import { Star } from "lucide-react";

interface UniversityTopContributorsProps {
    students: UniversityStudent[];
}

export function UniversityTopContributors({ students }: UniversityTopContributorsProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Elite Contributors</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {students.map((student, idx) => (
                    <div key={student.id} className="relative group">
                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-indigo-50 bg-gradient-to-br from-indigo-50/50 to-white hover:from-indigo-50 transition-all">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-xs font-black text-indigo-700 shadow-sm">
                                    {student.initials}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{student.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-500 font-medium">Placement:</span>
                                    <span className="text-[10px] font-bold text-emerald-600">{student.placementStatus}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Impact</p>
                                <p className="text-lg font-black text-indigo-700">{student.impactScore}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
