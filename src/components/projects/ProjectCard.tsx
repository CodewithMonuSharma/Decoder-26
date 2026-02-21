import Link from "next/link";
import { ArrowUpRight, Users, CheckCircle2 } from "lucide-react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusColors: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    planning: "bg-purple-50 text-purple-700 border-purple-200",
};

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const tasks = project.tasks ?? [];
    const techStack = project.techStack ?? [];
    const members = project.members ?? [];
    const doneTasks = tasks.filter((t) => t.status === "done").length;

    return (
        <Link href={`/projects/${project.id}`} className="block">
            <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 group cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[project.status]}`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                            <span className="text-[11px] text-gray-400">{project.category}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-[15px] group-hover:text-primary transition-colors truncate">
                            {project.name}
                        </h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {techStack.slice(0, 4).map((tech, idx) => (
                        <span
                            key={`${tech}-${idx}`}
                            className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md"
                        >
                            {tech}
                        </span>
                    ))}
                    {techStack.length > 4 && (
                        <span className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-500 rounded-md">
                            +{techStack.length - 4}
                        </span>
                    )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-semibold text-gray-700">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs">{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs">{doneTasks}/{tasks.length} tasks</span>
                    </div>
                    {/* Member avatars */}
                    <div className="flex -space-x-1.5">
                        {members.slice(0, 4).map((member, idx) => (
                            <div
                                key={member.userId || member.id || idx}
                                className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                                title={member.name}
                            >
                                <span className="text-[9px] font-semibold text-indigo-700">{member.initials}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
