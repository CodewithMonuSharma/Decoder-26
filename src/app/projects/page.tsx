"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

const FILTERS = ["All", "Active", "Completed", "Paused"];

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        fetch("/api/projects")
            .then((r) => r.json())
            .then((data) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = projects.filter((p) => {
        const matchesSearch =
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === "All" ||
            p.status?.toLowerCase() === activeFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout title="Projects">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">All Projects</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? "Loading..." : `${filtered.length} project${filtered.length !== 1 ? "s" : ""} found`}
                    </p>
                </div>
                <Link href="/projects/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Project
                    </Button>
                </Link>
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === f
                            ? "bg-primary text-white"
                            : "bg-white border border-border text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Project grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-44 bg-gray-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">
                    {search ? `No projects matching "${search}"` : "No projects yet — "}
                    {!search && <Link href="/projects/new" className="text-teal-600 hover:underline">create your first project</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id || project._id} project={{ ...project, id: project.id || project._id }} />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
