"use client";

interface ContributionScoreCardProps {
    score: number;
    impactScore: number;
    consistencyScore: number;
    taskScore: number;
    totalCommits: number;
    doneTasks: number;
    totalTasks: number;
    highImpactCommits: number;
}

function CircleGauge({ value, size = 140, strokeWidth = 10, color = "#6366f1" }: {
    value: number; size?: number; strokeWidth?: number; color?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const cx = size / 2;
    const cy = size / 2;

    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            <circle
                cx={cx} cy={cy} r={radius} fill="none"
                stroke={color} strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
            />
        </svg>
    );
}

export function ContributionScoreCard({
    score, impactScore, consistencyScore, taskScore,
    totalCommits, doneTasks, totalTasks, highImpactCommits,
}: ContributionScoreCardProps) {
    const sub = [
        { label: "Impact Score", value: impactScore, color: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-600" },
        { label: "Consistency", value: consistencyScore, color: "#14b8a6", bg: "bg-teal-50", text: "text-teal-600" },
        { label: "Task Completion", value: taskScore, color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600" },
    ];

    const stats = [
        { label: "Total Commits", value: totalCommits },
        { label: "Tasks Completed", value: `${doneTasks}/${totalTasks}` },
        { label: "High Impact", value: highImpactCommits },
    ];

    const scoreColor = score >= 75 ? "#6366f1" : score >= 50 ? "#f59e0b" : "#ef4444";

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">Contribution Score</h2>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Circular gauge */}
                <div className="relative flex-shrink-0">
                    <CircleGauge value={score} size={160} strokeWidth={12} color={scoreColor} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold text-gray-900">{score}</span>
                        <span className="text-xs text-gray-400 font-medium">out of 100</span>
                    </div>
                </div>

                {/* Sub-scores */}
                <div className="flex-1 w-full space-y-3">
                    {sub.map((s) => (
                        <div key={s.label}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-600">{s.label}</span>
                                <span className={`text-xs font-bold ${s.text}`}>{s.value}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${s.value}%`, backgroundColor: s.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
                {stats.map((s) => (
                    <div key={s.label} className="text-center">
                        <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
