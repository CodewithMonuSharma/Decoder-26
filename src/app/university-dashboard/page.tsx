"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getUniversityDemoData } from "@/lib/universityService";
import { PerformanceOverview } from "@/components/university/PerformanceOverview";
import { UniversityLeaderboard } from "@/components/university/UniversityLeaderboard";
import { TeamStatsCard } from "@/components/university/TeamStatsCard";
import { UniversityTopContributors } from "@/components/university/UniversityTopContributors";
import CommitsBarChart from "@/components/analytics/CommitsBarChart";
import ConsistencyLineChart from "@/components/analytics/ConsistencyLineChart";
import ImpactScoreCard from "@/components/analytics/ImpactScoreCard";
import { Trophy, Users, BarChart2 } from "lucide-react";

export default function UniversityDashboardPage() {
    const data = getUniversityDemoData();

    return (
        <DashboardLayout title="University Admin Dashboard">
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* 1. High Level Stats */}
                <PerformanceOverview stats={data.stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 2. Leaderboard (Main Area) */}
                    <div className="lg:col-span-2 space-y-8">
                        <UniversityLeaderboard students={data.students} />

                        {/* Analytics Graphs Section */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">University Technical Trends</h2>
                                    <p className="text-xs text-gray-500">Aggregate metrics across all departments</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-700 ml-1">Student Contribution Velocity</h3>
                                    <CommitsBarChart />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-700 ml-1">Aggregate Consistency Index</h3>
                                    <ConsistencyLineChart />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Sidebar Area */}
                    <div className="space-y-8">
                        {/* Top Contributors */}
                        <UniversityTopContributors students={data.topContributors} />

                        {/* Team Performance */}
                        <TeamStatsCard teams={data.teams} />

                        {/* Global Impact Summary */}
                        <ImpactScoreCard
                            score={data.stats.avgImpact}
                            trend="+4.2%"
                            description="The university's overall technical impact has grown by 4.2% this month due to increased research activity."
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
