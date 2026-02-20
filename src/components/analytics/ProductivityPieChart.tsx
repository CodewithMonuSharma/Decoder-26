"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { productivityData } from "./analyticsData";
import { PieChart as PieIcon } from "lucide-react";

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0].payload;
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">{name}</p>
                <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
                    {value}%
                </p>
            </div>
        );
    }
    return null;
};

const renderLegend = (props: any) => {
    const { payload } = props;
    return (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-500">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function ProductivityPieChart() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                    <PieIcon className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Productivity Distribution</h3>
                    <p className="text-xs text-gray-400">How you contribute</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={productivityData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {productivityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
