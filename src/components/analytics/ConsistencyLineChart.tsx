"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { consistencyData } from "./analyticsData";
import { Activity } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-teal-600">
                    {payload[0].value} activities
                </p>
            </div>
        );
    }
    return null;
};

export default function ConsistencyLineChart() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Consistency</h3>
                    <p className="text-xs text-gray-400">Daily activity over 14 days</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={consistencyData}>
                    <defs>
                        <linearGradient id="consistencyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        width={24}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="activity"
                        stroke="#14b8a6"
                        strokeWidth={2.5}
                        fill="url(#consistencyGradient)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
