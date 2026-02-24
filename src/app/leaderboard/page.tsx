"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Leaderboard } from "@/components/transcript/Leaderboard";
import { Trophy, RefreshCw, Loader2 } from "lucide-react";
import { TranscriptData } from "@/lib/transcriptService";

export default function GlobalLeaderboardPage() {
    const [data, setData] = useState<TranscriptData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/transcript?teamId=demo");
            const json = await res.json();
            setData(json);
        } catch {
            // Error handled by fallback
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <DashboardLayout title="Performance Leaderboard">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">Leaderboard</h1>
                            <p className="text-xs text-gray-500">Top contributors across the platform</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-gray-600" />}
                    </button>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : data ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Leaderboard entries={data.leaderboard} />
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No leaderboard data found.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
