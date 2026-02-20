"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { commitsData } from "./analyticsData";
import { GitCommitHorizontal } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-indigo-600">
                    {payload[0].value} commits
                </p>
            </div>
        );
    }
    return null;
};

export default function CommitsBarChart() {
    const max = Math.max(...commitsData.map((d) => d.commits));

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <GitCommitHorizontal className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Impactful Commits</h3>
                    <p className="text-xs text-gray-400">Weekly commit activity</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={commitsData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={24}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="commits" radius={[6, 6, 0, 0]}>
                        {commitsData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.commits === max ? "#6366f1" : "#c7d2fe"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
