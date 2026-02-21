"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CommitsBarChart from "@/components/analytics/CommitsBarChart";
import ImpactScoreCard from "@/components/analytics/ImpactScoreCard";
import ConsistencyLineChart from "@/components/analytics/ConsistencyLineChart";
import ContributionHeatmap from "@/components/analytics/ContributionHeatmap";
import ProductivityPieChart from "@/components/analytics/ProductivityPieChart";
import CommitImpactAnalytics from "@/components/analytics/CommitImpactAnalytics";
import { BarChart2, TrendingUp, GitCommitHorizontal, Activity } from "lucide-react";

const summaryStats = [
    {
        label: "Total Commits",
        value: "78",
        change: "+12 this week",
        positive: true,
        icon: GitCommitHorizontal,
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        label: "Impact Score",
        value: "82",
        change: "+8 pts this period",
        positive: true,
        icon: TrendingUp,
        color: "bg-violet-50 text-violet-600",
    },
    {
        label: "Active Days",
        value: "11 / 14",
        change: "79% consistency",
        positive: true,
        icon: Activity,
        color: "bg-teal-50 text-teal-600",
    },
    {
        label: "Contributions",
        value: "243",
        change: "Last 16 weeks",
        positive: true,
        icon: BarChart2,
        color: "bg-pink-50 text-pink-500",
    },
];

export default function AnalyticsPage() {
    return (
        <DashboardLayout title="Analytics">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                        <BarChart2 className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                </div>
                <p className="text-sm text-gray-500 ml-12">
                    Your personal contribution insights and performance overview.
                </p>
            </div>

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {summaryStats.map(({ label, value, change, positive, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3"
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                            <p className="text-xs font-medium text-gray-400 mt-0.5">{label}</p>
                        </div>
                        <p
                            className={`text-xs font-semibold ${positive ? "text-emerald-500" : "text-red-400"
                                }`}
                        >
                            {change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Row 1 – Commits (wide) + Impact Score (narrow) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2">
                    <CommitsBarChart />
                </div>
                <div>
                    <ImpactScoreCard />
                </div>
            </div>

            {/* Row 2 – Consistency (narrow) + Productivity Pie (narrow) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <ConsistencyLineChart />
                <ProductivityPieChart />
            </div>

            {/* Row 3 – Contribution Heatmap (full width) */}
            <div className="mb-5">
                <ContributionHeatmap />
            </div>

            {/* Row 4 – GitHub Commit Impact Analytics (full width) */}
            <div className="mb-2">
                <CommitImpactAnalytics teamId="demo" />
            </div>
        </DashboardLayout>
    );
}
