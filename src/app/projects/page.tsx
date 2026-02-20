import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
    return (
        <DashboardLayout title="Projects">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">All Projects</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{projects.length} projects in progress</p>
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
                        className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                {["All", "Active", "Completed", "Paused"].map((f) => (
                    <button
                        key={f}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${f === "All"
                                ? "bg-primary text-white"
                                : "bg-white border border-border text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Project grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </DashboardLayout>
    );
}
