import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { projects, activityFeed } from "@/lib/data";
import { FolderKanban, CheckCircle2, Users, TrendingUp } from "lucide-react";

const stats = [
    { label: "Active Projects", value: "3", icon: FolderKanban, change: "+1 this month", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Tasks Completed", value: "9", icon: CheckCircle2, change: "+4 this week", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Team Members", value: "5", icon: Users, change: "Across all projects", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Progress", value: "62%", icon: TrendingUp, change: "+8% this week", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function DashboardPage() {
    return (
        <DashboardLayout title="Dashboard">
            {/* Welcome */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Good afternoon, Arjun 👋</h2>
                <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what&apos;s happening with your projects today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const { Icon } = { Icon: stat.icon };
                    return (
                        <div key={stat.label} className="bg-white border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Projects */}
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Your Projects</h3>
                        <a href="/projects" className="text-xs text-primary hover:underline font-medium">View all</a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="xl:col-span-1">
                    <div className="bg-white border border-border rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <ActivityFeed events={activityFeed} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
