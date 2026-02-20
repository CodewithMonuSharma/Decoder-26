import DashboardLayout from "@/components/layout/DashboardLayout";
import { projects, members } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail } from "lucide-react";
import { notFound } from "next/navigation";

const roleColors: Record<string, string> = {
    Lead: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Developer: "bg-blue-50 text-blue-700 border-blue-200",
    Designer: "bg-pink-50 text-pink-700 border-pink-200",
    Tester: "bg-amber-50 text-amber-700 border-amber-200",
    Manager: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function TeamPage({ params }: { params: { id: string } }) {
    const project = projects.find((p) => p.id === params.id);
    if (!project) notFound();

    return (
        <DashboardLayout title="Team">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Team — {project.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{project.members.length} members collaborating</p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </Button>
            </div>

            {/* Member cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {project.members.map((member) => (
                    <div key={member.id} className="bg-white border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-indigo-700">{member.initials}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h3>
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${member.status === "active" ? "bg-emerald-500" : member.status === "away" ? "bg-amber-400" : "bg-gray-300"}`} />
                                </div>
                                <p className="text-xs text-gray-500 truncate mb-2">{member.email}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium border rounded-full ${roleColors[member.role]}`}>
                                    {member.role}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[11px] text-gray-400 mb-0.5">Tasks</p>
                                <p className="text-sm font-bold text-gray-800">{member.tasksAssigned}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 mb-0.5">Joined</p>
                                <p className="text-sm font-medium text-gray-700">{member.joinedDate}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-8">
                                <Mail className="w-3 h-3" />
                                Message
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Invite card */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Invite a Member</p>
                        <p className="text-xs text-gray-400">Share the project link</p>
                    </div>
                </div>
            </div>

            {/* Role summary */}
            <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Role Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(["Lead", "Developer", "Designer", "Tester", "Manager"] as const).map((role) => {
                        const count = project.members.filter((m) => m.role === role).length;
                        return (
                            <div key={role} className={`p-3 rounded-xl border text-center ${roleColors[role]}`}>
                                <p className="text-xl font-bold">{count}</p>
                                <p className="text-[11px] font-medium mt-0.5">{role}{count !== 1 ? "s" : ""}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
