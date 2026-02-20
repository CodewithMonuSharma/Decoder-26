"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskCard from "@/components/projects/TaskCard";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Task } from "@/types";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch tasks assigned to ME
        // For now, we'll fetch all projects and extract tasks
        fetch("/api/projects")
            .then((r) => r.json())
            .then((data) => {
                const allTasks = Array.isArray(data)
                    ? data.flatMap((p: any) => (p.tasks || []).map((t: any) => ({ ...t, projectName: p.name })))
                    : [];
                setTasks(allTasks);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const todo = tasks.filter(t => t.status === "todo");
    const inProgress = tasks.filter(t => t.status === "in-progress");
    const done = tasks.filter(t => t.status === "done");

    return (
        <DashboardLayout title="My Tasks">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage and track all your assignments across projects.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Todo Column */}
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <h2 className="text-sm font-semibold text-gray-700">To Do</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                            {todo.length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {todo.map(task => (
                            <div key={task.id} className="relative">
                                <TaskCard task={task} />
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded font-medium">
                                    {(task as any).projectName}
                                </div>
                            </div>
                        ))}
                        {todo.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-400 text-xs">No tasks to do</div>
                        )}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <h2 className="text-sm font-semibold text-gray-700">In Progress</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                            {inProgress.length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {inProgress.map(task => (
                            <div key={task.id} className="relative">
                                <TaskCard task={task} />
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-50 text-[10px] text-amber-600 rounded font-medium">
                                    {(task as any).projectName}
                                </div>
                            </div>
                        ))}
                        {inProgress.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-400 text-xs">No active tasks</div>
                        )}
                    </div>
                </div>

                {/* Done Column */}
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h2 className="text-sm font-semibold text-gray-700">Completed</h2>
                        </div>
                        <span className="text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                            {done.length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {done.map(task => (
                            <div key={task.id} className="relative">
                                <TaskCard task={task} />
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-50 text-[10px] text-emerald-600 rounded font-medium">
                                    {(task as any).projectName}
                                </div>
                            </div>
                        ))}
                        {done.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-400 text-xs">No completed tasks</div>
                        )}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="mt-10 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            )}
        </DashboardLayout>
    );
}
