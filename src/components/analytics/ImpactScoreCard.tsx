"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { impactScore } from "./analyticsData";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

interface ImpactScoreCardProps {
    score?: number;
    trend?: string;
    description?: string;
}

export default function ImpactScoreCard({ score: manualScore, trend: manualTrend, description: manualDesc }: ImpactScoreCardProps) {
    const { score: defaultScore, previousScore, label } = impactScore;
    const score = manualScore ?? defaultScore;
    const trendValue = manualScore !== undefined ? 0 : (score - previousScore);
    const isUp = manualTrend ? manualTrend.startsWith("+") : trendValue >= 0;
    const trendDisplay = manualTrend ?? `${isUp ? "+" : ""}${trendValue} pts from last period`;

    // Data shaped for RadialBar: background track + filled arc
    const data = [
        { name: "Score", value: score, fill: "#6366f1" },
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">{label}</h3>
                    <p className="text-xs text-gray-400">vs. last period</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
                {/* Circular progress */}
                <div className="relative w-36 h-36">
                    {/* Background track */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r="38"
                            fill="none"
                            stroke="#e0e7ff"
                            strokeWidth="9"
                        />
                        <circle
                            cx="50" cy="50" r="38"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="9"
                            strokeLinecap="round"
                            strokeDasharray={`${(score / 100) * 238.76} 238.76`}
                            style={{ transition: "stroke-dasharray 1s ease" }}
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-gray-900">{score}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-wide">/ 100</span>
                    </div>
                </div>

                <div
                    className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${isUp
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                        }`}
                >
                    {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {trendDisplay}
                </div>

                {manualDesc && (
                    <p className="mt-4 text-xs text-gray-500 leading-relaxed text-center italic border-t border-gray-50 pt-4">
                        {manualDesc}
                    </p>
                )}
            </div>
        </div>
    );
}
