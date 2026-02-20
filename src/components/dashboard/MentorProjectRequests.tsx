"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Check, X, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MentorProjectRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/projects");
            const projects = await res.json();
            // Filter projects where mentor is invited and status is pending
            const pending = projects.filter((p: any) => p.mentorStatus === "pending");
            setRequests(pending);
        } catch (e) {
            console.error("Failed to fetch project requests:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleResponse = async (projectId: string, status: "accepted" | "rejected") => {
        try {
            const res = await fetch(`/api/projects/${projectId}/mentor`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setRequests(requests.filter(r => r._id !== projectId));
            }
        } catch (e) {
            console.error("Failed to respond to request:", e);
        }
    };

    if (loading) return <div className="h-20 bg-gray-50 animate-pulse rounded-xl" />;
    if (requests.length === 0) return null;

    return (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Project Mentorship Requests</h3>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {requests.length} New
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((project) => (
                    <div key={project._id} className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{project.name}</h4>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                            <Link href={`/projects/${project._id}`} className="text-emerald-600 hover:text-emerald-700">
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 rounded-xl flex-1 gap-1.5"
                                onClick={() => handleResponse(project._id, "accepted")}
                            >
                                <Check className="w-4 h-4" /> Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 h-9 px-4 rounded-xl flex-1 gap-1.5"
                                onClick={() => handleResponse(project._id, "rejected")}
                            >
                                <X className="w-4 h-4" /> Decline
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
