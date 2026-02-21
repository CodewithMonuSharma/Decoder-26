"use client";

import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface SkillRadarChartProps {
    backend: number;
    frontend: number;
    database: number;
    ai: number;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
                <p className="text-xs font-bold text-indigo-600">{payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

export function SkillRadarChart({ backend, frontend, database, ai }: SkillRadarChartProps) {
    const data = [
        { skill: "Backend", value: backend },
        { skill: "Frontend", value: frontend },
        { skill: "Database", value: database },
        { skill: "AI / ML", value: ai },
    ];

    const skills = [
        { label: "Backend", value: backend, color: "bg-indigo-500", bar: "#6366f1" },
        { label: "Frontend", value: frontend, color: "bg-teal-500", bar: "#14b8a6" },
        { label: "Database", value: database, color: "bg-amber-500", bar: "#f59e0b" },
        { label: "AI / ML", value: ai, color: "bg-pink-500", bar: "#ec4899" },
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">AI Skill Detection</h2>

            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Radar Chart */}
                <div className="w-full" style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis
                                dataKey="skill"
                                tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Radar
                                dataKey="value"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.15}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend + bars */}
                <div className="w-full lg:w-48 space-y-3 flex-shrink-0">
                    {skills.map((s) => (
                        <div key={s.label}>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                    <span className={`inline-block w-2 h-2 rounded-full ${s.color}`} />
                                    {s.label}
                                </span>
                                <span className="text-xs font-bold text-gray-800">{s.value}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${s.value}%`, backgroundColor: s.bar }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
