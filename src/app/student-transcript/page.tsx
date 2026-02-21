"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ContributionScoreCard } from "@/components/transcript/ContributionScoreCard";
import { SkillRadarChart } from "@/components/transcript/SkillRadarChart";
import { RoleDetectionBadge } from "@/components/transcript/RoleDetectionBadge";
import { ConsistencyTimelineChart } from "@/components/transcript/ConsistencyTimelineChart";
import { AIGeneratedSummary } from "@/components/transcript/AIGeneratedSummary";
import { Leaderboard } from "@/components/transcript/Leaderboard";
import { UniversityBanner } from "@/components/transcript/UniversityBanner";
import { TranscriptData } from "@/lib/transcriptService";
import { FileText, University, Printer, RefreshCw } from "lucide-react";

const TEAM_ID = "demo";

export default function StudentTranscriptPage() {
    const [transcript, setTranscript] = useState<TranscriptData | null>(null);
    const [loading, setLoading] = useState(true);
    const [uniView, setUniView] = useState(false);

    const loadTranscript = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/transcript?teamId=${TEAM_ID}`);
            const data = await res.json();
            setTranscript(data);
        } catch {
            // silently fail — API will return demo data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTranscript();
    }, []);

    const generatedDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    if (loading) {
        return (
            <DashboardLayout title="Student Transcript">
                <div className="space-y-4 max-w-5xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    if (!transcript) return null;

    // ── University Print View ─────────────────────────────────────────────────
    if (uniView) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-0">
                <div className="max-w-3xl mx-auto space-y-5">
                    {/* Controls (hidden on print) */}
                    <div className="flex justify-end gap-2 print:hidden">
                        <button
                            onClick={() => setUniView(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            ← Back to Dashboard View
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" /> Print / Export PDF
                        </button>
                    </div>

                    {/* Official Header */}
                    <div className="bg-white border-2 border-indigo-900 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-indigo-900 text-white px-8 py-6 text-center">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-300 mb-1">CollabSpace · University Evaluation System</p>
                            <h1 className="text-2xl font-extrabold tracking-tight">AI Verified Contribution Transcript</h1>
                            <p className="text-indigo-300 text-xs mt-1">Issued: {generatedDate} · Ref: VCT-{transcript.teamId.toUpperCase()}-2026</p>
                        </div>

                        {/* Student details */}
                        <div className="px-8 py-6 border-b border-gray-200">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                {[
                                    { label: "Student Name", value: transcript.studentName },
                                    { label: "Email", value: transcript.studentEmail },
                                    { label: "AI Role", value: transcript.role },
                                    { label: "Contribution Score", value: `${transcript.contributionScore} / 100` },
                                    { label: "Impact Score", value: `${transcript.impactScore} / 100` },
                                    { label: "Consistency", value: `${transcript.consistencyScore}%` },
                                ].map((f) => (
                                    <div key={f.label}>
                                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{f.label}</p>
                                        <p className="font-bold text-gray-900 mt-0.5">{f.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="px-8 py-5 border-b border-gray-200">
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">AI Generated Evaluation</p>
                            <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{transcript.aiSummary}&rdquo;</p>
                        </div>

                        {/* Skill Breakdown */}
                        <div className="px-8 py-5 border-b border-gray-200">
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Technical Skill Profile</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: "Backend", value: transcript.skills.backend },
                                    { label: "Frontend", value: transcript.skills.frontend },
                                    { label: "Database", value: transcript.skills.database },
                                    { label: "AI / ML", value: transcript.skills.ai },
                                ].map((s) => (
                                    <div key={s.label} className="text-center bg-gray-50 rounded-xl py-3 px-2">
                                        <p className="text-2xl font-extrabold text-indigo-700">{s.value}%</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team Leaderboard */}
                        <div className="px-8 py-5 border-b border-gray-200">
                            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Team Leaderboard</p>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] text-gray-400">
                                        <th className="pb-2 font-semibold">Rank</th>
                                        <th className="pb-2 font-semibold">Contributor</th>
                                        <th className="pb-2 font-semibold">Role</th>
                                        <th className="pb-2 font-semibold">Commits</th>
                                        <th className="pb-2 font-semibold text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transcript.leaderboard.map((e) => (
                                        <tr key={e.rank}>
                                            <td className="py-2 font-bold text-gray-400">#{e.rank}</td>
                                            <td className="py-2 font-semibold text-gray-900">{e.name}</td>
                                            <td className="py-2 text-gray-500">{e.role}</td>
                                            <td className="py-2 text-gray-500">{e.commits}</td>
                                            <td className="py-2 font-bold text-indigo-700 text-right">{e.contributionScore}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer seal */}
                        <div className="px-8 py-5 bg-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] text-gray-400">Verified by CollabSpace Intelligence Engine v1.0</p>
                                <p className="text-[11px] text-gray-400">This transcript is AI-generated and reflects real project contributions.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-indigo-700">VERIFIED</p>
                                <p className="text-[10px] text-gray-400">AI Authenticated</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Standard Dashboard View ───────────────────────────────────────────────
    return (
        <DashboardLayout title="Student Transcript">
            <div className="max-w-5xl mx-auto space-y-5">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-gray-900">AI Verified Contribution Transcript</h1>
                            <p className="text-xs text-gray-400">Powered by CollabSpace Intelligence Engine</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadTranscript}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh
                        </button>
                        <button
                            onClick={() => setUniView(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <University className="w-4 h-4" /> University View
                        </button>
                    </div>
                </div>

                {/* University Banner */}
                <UniversityBanner
                    studentName={transcript.studentName}
                    studentEmail={transcript.studentEmail}
                    role={transcript.role}
                    contributionScore={transcript.contributionScore}
                    generatedDate={generatedDate}
                />

                {/* Row 1: Contribution Score + AI Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <ContributionScoreCard
                        score={transcript.contributionScore}
                        impactScore={transcript.impactScore}
                        consistencyScore={transcript.consistencyScore}
                        taskScore={transcript.taskScore}
                        totalCommits={transcript.totalCommits}
                        doneTasks={transcript.doneTasks}
                        totalTasks={transcript.totalTasks}
                        highImpactCommits={transcript.highImpactCommits}
                    />
                    <div className="flex flex-col gap-5">
                        <RoleDetectionBadge role={transcript.role} description={transcript.roleDescription} />
                        <AIGeneratedSummary
                            summary={transcript.aiSummary}
                            studentName={transcript.studentName}
                            role={transcript.role}
                        />
                    </div>
                </div>

                {/* Row 2: Skill Radar + Consistency */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <SkillRadarChart
                        backend={transcript.skills.backend}
                        frontend={transcript.skills.frontend}
                        database={transcript.skills.database}
                        ai={transcript.skills.ai}
                    />
                    <ConsistencyTimelineChart
                        data={transcript.consistencyTimeline}
                        score={transcript.consistencyScore}
                    />
                </div>

                {/* Row 3: Leaderboard full width */}
                <Leaderboard entries={transcript.leaderboard} />
            </div>
        </DashboardLayout>
    );
}
