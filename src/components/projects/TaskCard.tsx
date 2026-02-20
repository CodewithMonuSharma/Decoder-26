import { Task, Member } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

const priorityConfig = {
    high: { label: "High", className: "bg-red-50 text-red-700 border-red-200" },
    medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200" },
    low: { label: "Low", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

interface TaskCardProps {
    task: Task;
    assignee?: Member;
}

export default function TaskCard({ task, assignee }: TaskCardProps) {
    const priority = priorityConfig[task.priority];

    return (
        <div className="bg-white border border-border rounded-lg p-3.5 hover:shadow-sm hover:border-primary/20 transition-all duration-150 cursor-pointer">
            {/* Priority + Due */}
            <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border ${priority.className}`}>
                    {task.priority === "high" && <AlertCircle className="w-2.5 h-2.5" />}
                    {priority.label}
                </span>
                <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[11px]">{task.dueDate}</span>
                </div>
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-gray-900 leading-snug mb-3">
                {task.title}
            </p>

            {/* Assignee */}
            {assignee && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-semibold text-indigo-700">{assignee.initials}</span>
                    </div>
                    <span className="text-xs text-gray-500 truncate">{assignee.name}</span>
                </div>
            )}
        </div>
    );
}
