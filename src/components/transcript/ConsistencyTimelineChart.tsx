"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

interface ConsistencyTimelineChartProps {
    data: { date: string; score: number }[];
    score: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
                <p className="text-[11px] text-gray-400">{label}</p>
                <p className="text-sm font-bold text-teal-600">{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export function ConsistencyTimelineChart({ data, score }: ConsistencyTimelineChartProps) {
    const scoreColor = score >= 70 ? "#14b8a6" : score >= 40 ? "#f59e0b" : "#ef4444";

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900">Consistency Timeline</h2>
                        <p className="text-[11px] text-gray-400">Last 14 days of activity</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-extrabold" style={{ color: scoreColor }}>{score}%</p>
                    <p className="text-[11px] text-gray-400">consistency</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="consistencyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        fill="url(#consistencyGrad)"
                        dot={{ r: 3, fill: "#14b8a6", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#14b8a6" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
