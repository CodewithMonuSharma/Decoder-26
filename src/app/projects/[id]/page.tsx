"use client";

import { useEffect, useState, use } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskCard from "@/components/projects/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    planning: "bg-purple-50 text-purple-700 border-purple-200",
};

const roleColors: Record<string, string> = {
    Lead: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Developer: "bg-blue-50 text-blue-700 border-blue-200",
    Designer: "bg-pink-50 text-pink-700 border-pink-200",
    Tester: "bg-amber-50 text-amber-700 border-amber-200",
    Manager: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/projects/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setProject(data.error ? null : data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-4 animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-96 bg-gray-100 rounded" />
                    <div className="h-24 bg-gray-100 rounded-xl" />
                </div>
            </DashboardLayout>
        );
    }

    if (!project) {
        return (
            <DashboardLayout>
                <div className="text-center py-20 text-gray-400">
                    Project not found.{" "}
                    <Link href="/projects" className="text-teal-600 hover:underline">Go back</Link>
                </div>
            </DashboardLayout>
        );
    }

    const tasks: any[] = project.tasks ?? [];
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
    const doneTasks = tasks.filter((t) => t.status === "done");

    return (
        <DashboardLayout>
            {/* Project Header */}
            <div className="mb-6">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Link href="/projects" className="hover:text-primary">Projects</Link>
                    <span>/</span>
                    <span className="text-gray-700 font-medium">{project.name}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[project.status] ?? ""}`}>
                                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                            </span>
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                {project.category}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/projects/${id}/team`}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <UserPlus className="w-3.5 h-3.5" />
                                Invite
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Progress + meta */}
                <div className="mt-5 p-4 bg-white border border-border rounded-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Progress</p>
                            <div className="flex items-center gap-2">
                                <Progress value={project.progress} className="h-2 flex-1" />
                                <span className="text-sm font-semibold text-gray-800">{project.progress}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Team</p>
                            <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-1.5">
                                    {(project.members ?? []).slice(0, 4).map((m: any, i: number) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                                            <span className="text-[9px] font-semibold text-indigo-700">{m.initials}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-800">{project.teamSize}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Tasks Done</p>
                            <p className="text-sm font-semibold text-gray-800">{doneTasks.length}/{tasks.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Category</p>
                            <p className="text-sm font-semibold text-gray-800">{project.category ?? "—"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="tasks">
                <TabsList className="mb-5 bg-white border border-border p-1 h-auto rounded-lg">
                    <TabsTrigger value="overview" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all">
                        Tasks ({tasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="team" className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all">
                        Team ({project.teamSize})
                    </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-white border border-border rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">About this project</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                        </div>
                        <div className="bg-white border border-border rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {(project.techStack ?? []).map((tech: string) => (
                                    <span key={tech} className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg border border-primary/20">{tech}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white border border-border rounded-xl p-5 col-span-full">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Task Summary</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "To Do", count: todoTasks.length, color: "bg-gray-100 text-gray-700" },
                                    { label: "In Progress", count: inProgressTasks.length, color: "bg-amber-50 text-amber-700" },
                                    { label: "Done", count: doneTasks.length, color: "bg-emerald-50 text-emerald-700" },
                                ].map((s) => (
                                    <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
                                        <p className="text-2xl font-bold">{s.count}</p>
                                        <p className="text-xs font-medium mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Tasks Kanban */}
                <TabsContent value="tasks">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "To Do", tasks: todoTasks, dotColor: "bg-gray-400" },
                            { label: "In Progress", tasks: inProgressTasks, dotColor: "bg-amber-400" },
                            { label: "Done", tasks: doneTasks, dotColor: "bg-emerald-500" },
                        ].map((col) => (
                            <div key={col.label} className="bg-gray-100/70 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                                        <h4 className="text-xs font-semibold text-gray-700">{col.label}</h4>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white border border-border rounded-full px-2 py-0.5 font-medium">
                                        {col.tasks.length}
                                    </span>
                                </div>
                                <div className="space-y-2.5">
                                    {col.tasks.map((task: any) => (
                                        <TaskCard key={task.id || task._id} task={{ ...task, id: task.id || task._id }} />
                                    ))}
                                    {col.tasks.length === 0 && (
                                        <div className="h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                                            <p className="text-xs text-gray-400">No tasks</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Team */}
                <TabsContent value="team">
                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <h3 className="text-sm font-semibold text-gray-900">{project.teamSize} Members</h3>
                            <Link href={`/projects/${id}/team`}>
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Invite Member
                                </Button>
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {(project.members ?? []).map((member: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-semibold text-indigo-700">{member.initials}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${roleColors[member.role] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                        {member.role}
                                    </span>
                                    <div className="text-right min-w-[64px]">
                                        <p className="text-xs font-semibold text-gray-800">{member.tasksAssigned}</p>
                                        <p className="text-[10px] text-gray-400">tasks</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${member.status === "active" ? "bg-emerald-500" : member.status === "away" ? "bg-amber-400" : "bg-gray-300"}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
