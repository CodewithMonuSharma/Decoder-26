"use client";

import { Sparkles, Quote } from "lucide-react";

interface AIGeneratedSummaryProps {
    summary: string;
    studentName: string;
    role: string;
}

export function AIGeneratedSummary({ summary, studentName, role }: AIGeneratedSummaryProps) {
    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900">AI Generated Summary</h2>
                    <p className="text-[11px] text-gray-400">Verified by CollabSpace Intelligence Engine</p>
                </div>
            </div>

            <div className="relative">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-indigo-200" />
                <blockquote className="pl-6 pr-2 py-1 text-sm text-gray-700 leading-relaxed italic font-medium">
                    {summary}
                </blockquote>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-100 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-900">{studentName}</p>
                    <p className="text-[11px] text-indigo-500 font-medium">{role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-gray-400 font-medium">AI Verified</span>
                </div>
            </div>
        </div>
    );
}
