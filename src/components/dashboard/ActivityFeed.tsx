import { ActivityEvent } from "@/lib/types";
import { CheckCircle2, UserPlus, FolderPlus, MessageSquare, ClipboardCheck, RefreshCw } from "lucide-react";

const iconMap = {
    task_completed: { Icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    member_joined: { Icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
    project_created: { Icon: FolderPlus, color: "text-purple-600", bg: "bg-purple-50" },
    comment: { Icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
    task_assigned: { Icon: ClipboardCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    status_updated: { Icon: RefreshCw, color: "text-gray-600", bg: "bg-gray-100" },
};

interface ActivityFeedProps {
    events: ActivityEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
    return (
        <div className="space-y-0">
            {events.map((event, idx) => {
                const config = iconMap[event.type];
                const { Icon } = config;
                return (
                    <div key={event.id} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                        <div className={`w-7 h-7 rounded-full ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-snug">
                                <span className="font-medium text-gray-900">{event.userName}</span>{" "}
                                {event.message}{" "}
                                <span className="text-primary font-medium">{event.projectName}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{event.timeAgo}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
