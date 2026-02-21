"use client";

import { GraduationCap, Shield, Calendar } from "lucide-react";

interface UniversityBannerProps {
    studentName: string;
    studentEmail: string;
    role: string;
    contributionScore: number;
    generatedDate: string;
}

export function UniversityBanner({
    studentName,
    studentEmail,
    role,
    contributionScore,
    generatedDate,
}: UniversityBannerProps) {
    return (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Seal */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Header text */}
                <div className="flex-1">
                    <p className="text-indigo-300 text-[11px] font-semibold uppercase tracking-[0.2em] mb-1">
                        CollabSpace · AI Verified Contribution Transcript
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{studentName}</h1>
                    <p className="text-indigo-300 text-sm mt-0.5">{studentEmail}</p>
                </div>

                {/* Score badge */}
                <div className="flex-shrink-0 text-center bg-white/10 border border-white/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
                    <p className="text-4xl font-black">{contributionScore}</p>
                    <p className="text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">/ 100</p>
                    <p className="text-[10px] text-indigo-300 mt-1 font-medium">Contribution Score</p>
                </div>
            </div>

            {/* Footer bar */}
            <div className="mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center gap-4 text-[12px] text-indigo-300">
                <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> AI Verified · CollabSpace Intelligence Engine v1.0
                </span>
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Generated: {generatedDate}
                </span>
                <span className="ml-auto font-semibold text-white">{role}</span>
            </div>
        </div>
    );
}
