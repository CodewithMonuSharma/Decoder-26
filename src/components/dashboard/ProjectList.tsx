"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import Link from "next/link";

export function ProjectList() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/projects")
            .then((r) => r.json())
            .then((data) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                No projects yet — <Link href="/projects/new" className="text-teal-600 hover:underline">create one</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project.id || project._id} project={{
                    ...project,
                    id: project.id || project._id,
                }} />
            ))}
        </div>
    );
}
