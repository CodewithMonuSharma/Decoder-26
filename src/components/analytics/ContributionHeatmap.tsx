"use client";

import { heatmapData } from "./analyticsData";
import { CalendarDays } from "lucide-react";

const INTENSITY_COLORS = [
    "bg-gray-100",        // 0 – no activity
    "bg-indigo-200",      // 1
    "bg-indigo-400",      // 2
    "bg-indigo-600",      // 3
    "bg-indigo-800",      // 4 – highest
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getIntensity(count: number) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
}

export default function ContributionHeatmap() {
    // Group days into weeks (columns of 7)
    const weeks: typeof heatmapData[0][][] = [];
    let week: typeof heatmapData[0][] = [];

    // Pad first week so Sunday is col-0
    const firstDay = new Date(heatmapData[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
        week.push({ date: "", count: -1 }); // empty placeholder
    }

    for (const day of heatmapData) {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length > 0) {
        while (week.length < 7) week.push({ date: "", count: -1 });
        weeks.push(week);
    }

    // Month labels: find first day of each month that appears
    const monthLabels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((w, wIdx) => {
        w.forEach((d) => {
            if (d.date) {
                const m = new Date(d.date).getMonth();
                if (m !== lastMonth) {
                    lastMonth = m;
                    monthLabels.push({
                        label: new Date(d.date).toLocaleString("default", { month: "short" }),
                        colIndex: wIdx,
                    });
                }
            }
        });
    });

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Contribution Activity</h3>
                    <p className="text-xs text-gray-400">Last 16 weeks · GitHub-style</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-max">
                    {/* Month labels */}
                    <div
                        className="flex mb-1"
                        style={{ paddingLeft: "28px" }}
                    >
                        {weeks.map((_, wIdx) => {
                            const lbl = monthLabels.find((m) => m.colIndex === wIdx);
                            return (
                                <div key={wIdx} className="w-4 mr-1 text-[10px] text-gray-400 font-medium">
                                    {lbl ? lbl.label : ""}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-1">
                        {/* Day-of-week labels */}
                        <div className="flex flex-col gap-1 mr-1 pt-0.5">
                            {DAY_LABELS.map((d, i) => (
                                <div
                                    key={d}
                                    className={`w-5 h-4 text-[10px] text-gray-400 leading-4 font-medium ${i % 2 === 0 ? "opacity-0" : ""
                                        }`}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Heatmap grid */}
                        {weeks.map((w, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-1">
                                {w.map((day, dIdx) => {
                                    if (day.count < 0) {
                                        return <div key={dIdx} className="w-4 h-4" />;
                                    }
                                    const intensity = getIntensity(day.count);
                                    return (
                                        <div
                                            key={dIdx}
                                            title={day.date ? `${day.date}: ${day.count} contributions` : ""}
                                            className={`w-4 h-4 rounded-sm ${INTENSITY_COLORS[intensity]} cursor-default transition-transform hover:scale-110`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-1.5 mt-3 justify-end">
                        <span className="text-[10px] text-gray-400 mr-1">Less</span>
                        {INTENSITY_COLORS.map((cls, i) => (
                            <div key={i} className={`w-3.5 h-3.5 rounded-sm ${cls}`} />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
