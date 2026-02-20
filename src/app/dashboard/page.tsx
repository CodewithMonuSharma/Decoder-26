import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { activityFeed } from "@/lib/data";
import { FolderKanban, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardStatsSection } from "@/components/dashboard/DashboardStatsSection";
import { ProjectList } from "@/components/dashboard/ProjectList";
import MentorStudentList from "@/components/dashboard/MentorStudentList";
import MentorProjectRequests from "@/components/dashboard/MentorProjectRequests";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/auth/login");
    const { user } = session;

    return (
        <DashboardLayout title="Dashboard">
            {/* Welcome */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                    Good day, {user.name} 👋
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    You're logged in as a <span className="text-teal-600 font-semibold">{user.role}</span>.
                </p>
            </div>

            <DashboardStatsSection />

            {/* Main content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Projects or Mentor tracking */}
                <div className="xl:col-span-2 space-y-8">
                    {user.role === "mentor" && (
                        <>
                            <MentorProjectRequests />
                            <MentorStudentList />
                        </>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Your Projects</h3>
                            <Link href="/projects" className="text-xs text-primary hover:underline font-medium">View all</Link>
                        </div>
                        <ProjectList />
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
