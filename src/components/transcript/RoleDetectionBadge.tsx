"use client";

import { Crown, Star, UserCheck, User } from "lucide-react";
import { ContributorRole } from "@/lib/transcriptService";

interface RoleDetectionBadgeProps {
    role: ContributorRole;
    description: string;
}

const roleConfig: Record<ContributorRole, {
    icon: React.ElementType;
    gradient: string;
    badge: string;
    text: string;
    border: string;
}> = {
    "Leader": {
        icon: Crown,
        gradient: "from-indigo-600 to-violet-600",
        badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
        text: "text-indigo-700",
        border: "border-indigo-100",
    },
    "Core Contributor": {
        icon: Star,
        gradient: "from-teal-500 to-emerald-500",
        badge: "bg-teal-100 text-teal-700 border-teal-200",
        text: "text-teal-700",
        border: "border-teal-100",
    },
    "Contributor": {
        icon: UserCheck,
        gradient: "from-amber-500 to-orange-500",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        text: "text-amber-700",
        border: "border-amber-100",
    },
    "Passive Member": {
        icon: User,
        gradient: "from-gray-400 to-gray-500",
        badge: "bg-gray-100 text-gray-600 border-gray-200",
        text: "text-gray-600",
        border: "border-gray-100",
    },
};

export function RoleDetectionBadge({ role, description }: RoleDetectionBadgeProps) {
    const config = roleConfig[role];
    const Icon = config.icon;

    return (
        <div className={`bg-white border ${config.border} rounded-2xl p-6 shadow-sm`}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">AI Role Detection</h2>

            <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${config.badge} mb-1`}>
                        {role}
                    </span>
                    <p className="text-[11px] text-gray-400">Detected by AI Analysis</p>
                </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                {description}
            </p>
        </div>
    );
}
