// ─── Analytics Dummy Data ───────────────────────────────────────────────────
// All data is dummy. Replace each export with a real API call when ready.

export type CommitDataPoint = {
    date: string;
    commits: number;
};

export type ConsistencyDataPoint = {
    date: string;
    activity: number;
};

export type ProductivityCategory = {
    name: string;
    value: number;
    color: string;
};

export type HeatmapDay = {
    date: string;   // ISO date string  e.g. "2025-12-01"
    count: number;  // 0 = no activity, 1-4 = intensity levels
};

// 1. Impactful Commits (last 8 weeks, one bar per week)
export const commitsData: CommitDataPoint[] = [
    { date: "Dec 23", commits: 3 },
    { date: "Dec 30", commits: 7 },
    { date: "Jan 06", commits: 5 },
    { date: "Jan 13", commits: 12 },
    { date: "Jan 20", commits: 8 },
    { date: "Jan 27", commits: 15 },
    { date: "Feb 03", commits: 11 },
    { date: "Feb 10", commits: 17 },
];

// 2. Impact Score
export const impactScore = {
    score: 82,          // out of 100
    previousScore: 74,  // to compute trend
    label: "Impact Score",
};

// 3. Consistency (daily activity over last 14 days)
export const consistencyData: ConsistencyDataPoint[] = [
    { date: "Feb 07", activity: 4 },
    { date: "Feb 08", activity: 2 },
    { date: "Feb 09", activity: 6 },
    { date: "Feb 10", activity: 8 },
    { date: "Feb 11", activity: 3 },
    { date: "Feb 12", activity: 7 },
    { date: "Feb 13", activity: 5 },
    { date: "Feb 14", activity: 9 },
    { date: "Feb 15", activity: 6 },
    { date: "Feb 16", activity: 11 },
    { date: "Feb 17", activity: 4 },
    { date: "Feb 18", activity: 8 },
    { date: "Feb 19", activity: 10 },
    { date: "Feb 20", activity: 7 },
];

// 4. Contribution Heatmap (last 16 weeks of daily data)
function makeDays(): HeatmapDay[] {
    const days: HeatmapDay[] = [];
    const end = new Date("2026-02-20");
    const start = new Date(end);
    start.setDate(end.getDate() - 111); // 112 days = 16 weeks
    const patterns = [0, 0, 1, 2, 0, 3, 4, 0, 1, 1, 2, 0, 0, 3];
    let i = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push({
            date: d.toISOString().split("T")[0],
            count: patterns[i % patterns.length],
        });
        i++;
    }
    return days;
}
export const heatmapData: HeatmapDay[] = makeDays();

// 5. Productivity Distribution
export const productivityData: ProductivityCategory[] = [
    { name: "Commits", value: 42, color: "#6366f1" },
    { name: "Tasks Completed", value: 28, color: "#14b8a6" },
    { name: "Messages", value: 18, color: "#f59e0b" },
    { name: "Reviews", value: 12, color: "#ec4899" },
];
